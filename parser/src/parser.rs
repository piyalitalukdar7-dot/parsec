use crate::ast::*;
use crate::error::{ParseError, Result};
use crate::lexer::{Lexer, Token, TokenType};
use std::collections::HashMap;

pub struct Parser {
    lexer: Lexer,
    current_token: Token,
}

impl Parser {
    pub fn new(mut lexer: Lexer) -> Self {
        let current_token = lexer.next_token().unwrap_or(Token {
            token_type: TokenType::Eof,
            position: 0,
            length: 0,
        });
        Parser {
            lexer,
            current_token,
        }
    }

    pub fn parse_program(&mut self) -> Result<Program> {
        let mut imports = vec![];
        let mut components = vec![];
        let mut app = None;

        while !self.is_eof() {
            // Skip whitespace tokens
            if matches!(self.current_token.token_type, TokenType::Whitespace) {
                self.advance()?;
                continue;
            }

            if self.match_tag("import") {
                imports.push(self.parse_import()?);
            } else if self.match_tag("component") {
                components.push(self.parse_component()?);
            } else if self.match_tag("app") {
                app = Some(self.parse_app()?);
            } else {
                self.advance()?;
            }
        }

        Ok(Program {
            app,
            imports,
            components,
        })
    }

    fn parse_import(&mut self) -> Result<Import> {
        self.consume_tag("import")?;
        let path = self.expect_string()?;
        Ok(Import { path })
    }

    fn parse_component(&mut self) -> Result<ComponentDef> {
        self.consume_tag("component")?;
        let name = self.expect_identifier()?;
        let mut props = vec![];

        while !self.match_token(&TokenType::TagClose) && !self.is_eof() {
            props.push(self.expect_identifier()?);
        }

        self.consume_token(&TokenType::TagClose)?;
        let children = self.parse_children(&["component"])?;
        Ok(ComponentDef {
            name,
            props,
            children,
        })
    }

    fn parse_app(&mut self) -> Result<AppNode> {
        self.consume_tag("app")?;
        let _attrs = self.parse_attributes()?;
        self.consume_token(&TokenType::TagClose)?;

        let mut meta = None;
        let mut views = vec![];

        while !self.match_end_tag("app") && !self.is_eof() {
            if self.match_tag("meta") {
                meta = Some(self.parse_meta()?);
            } else if self.match_tag("view") {
                views.push(self.parse_view()?);
            } else {
                self.advance()?;
            }
        }

        self.consume_end_tag("app")?;
        Ok(AppNode { meta, views })
    }

    fn parse_meta(&mut self) -> Result<MetaNode> {
        self.consume_tag("meta")?;
        let attrs = self.parse_attributes()?;
        self.consume_token(&TokenType::TagSelfClose)?;
        Ok(MetaNode { attrs })
    }

    fn parse_view(&mut self) -> Result<ViewNode> {
        self.consume_tag("view")?;
        let attrs = self.parse_attributes()?;
        let path = attrs.get("path").and_then(|v| match v {
            AttributeValue::String(s) => Some(s.clone()),
            _ => None,
        });

        self.consume_token(&TokenType::TagClose)?;
        let children = self.parse_children(&["view"])?;
        self.consume_end_tag("view")?;

        Ok(ViewNode { path, children })
    }

    fn parse_attributes(&mut self) -> Result<HashMap<String, AttributeValue>> {
        let mut attrs = HashMap::new();

        while !self.match_token(&TokenType::TagClose)
            && !self.match_token(&TokenType::TagSelfClose)
            && !self.is_eof()
        {
            if let TokenType::Identifier(name) = &self.current_token.token_type {
                let key = name.clone();
                self.advance()?;

                if self.match_token(&TokenType::Equals) {
                    self.advance()?;
                    let value = self.parse_attribute_value()?;
                    attrs.insert(key, value);
                }
            } else {
                self.advance()?;
            }
        }

        Ok(attrs)
    }

    fn parse_attribute_value(&mut self) -> Result<AttributeValue> {
        match &self.current_token.token_type {
            TokenType::String(s) => {
                let val = AttributeValue::String(s.clone());
                self.advance()?;
                Ok(val)
            }
            TokenType::Number(n) => {
                let val = n.parse::<f64>()
                    .map(AttributeValue::Number)
                    .map_err(|_| ParseError::new_parser(
                        self.current_token.position,
                        "Invalid number",
                    ))?;
                self.advance()?;
                Ok(val)
            }
            TokenType::BindingStart => {
                self.advance()?;
                let expr = self.parse_binding_expression()?;
                self.consume_token(&TokenType::BindingEnd)?;
                Ok(AttributeValue::Binding(Binding { expression: expr }))
            }
            _ => Err(ParseError::new_parser(
                self.current_token.position,
                "Expected attribute value",
            )),
        }
    }

    fn parse_binding_expression(&mut self) -> Result<String> {
        let mut expr = String::new();
        let mut depth = 1;

        while !self.is_eof() && depth > 0 {
            match &self.current_token.token_type {
                TokenType::BindingStart => depth += 1,
                TokenType::BindingEnd => {
                    depth -= 1;
                    if depth == 0 {
                        break;
                    }
                }
                _ => {}
            }

            expr.push_str(&self.current_token_to_string());
            self.advance()?;
        }

        Ok(expr)
    }

    fn parse_children(&mut self, end_tags: &[&str]) -> Result<Vec<Node>> {
        let mut children = vec![];

        while !self.is_eof() {
            // Check for end tags
            if end_tags.iter().any(|tag| self.match_end_tag(tag)) {
                break;
            }

            match &self.current_token.token_type {
                TokenType::TagOpen => {
                    // Check which type of tag
                    if let TokenType::Identifier(tag_name) = &self.peek_next()?.token_type {
                        match tag_name.as_str() {
                            "if" => children.push(self.parse_conditional()?),
                            "for" => children.push(self.parse_loop()?),
                            _ => children.push(self.parse_element()?),
                        }
                    } else {
                        self.advance()?;
                    }
                }
                TokenType::BindingStart => {
                    let expr = self.parse_attribute_value()?;
                    if let AttributeValue::Binding(b) = expr {
                        children.push(Node::Binding(b));
                    }
                }
                _ => {
                    self.advance()?;
                }
            }
        }

        Ok(children)
    }

    fn parse_element(&mut self) -> Result<Node> {
        self.consume_token(&TokenType::TagOpen)?;

        let tag = self.expect_identifier()?;
        let attrs = self.parse_attributes()?;

        if self.match_token(&TokenType::TagSelfClose) {
            self.advance()?;
            return Ok(Node::Element {
                tag,
                attrs,
                children: vec![],
            });
        }

        self.consume_token(&TokenType::TagClose)?;
        let children = self.parse_children(&[&tag])?;
        self.consume_end_tag(&tag)?;

        Ok(Node::Element {
            tag,
            attrs,
            children,
        })
    }

    fn parse_conditional(&mut self) -> Result<Node> {
        self.consume_tag("if")?;
        let condition = self.parse_attribute_value()?;
        self.consume_token(&TokenType::TagClose)?;

        let then_body = self.parse_children(&["if", "else"])?;

        let else_body = if self.match_tag("else") {
            self.consume_tag("else")?;
            self.consume_token(&TokenType::TagClose)?;
            Some(self.parse_children(&["else"])?)
        } else {
            None
        };

        self.consume_end_tag("if")?;

        if let AttributeValue::Binding(binding) = condition {
            Ok(Node::Conditional {
                condition: binding,
                then_body,
                else_body,
            })
        } else {
            Err(ParseError::new_parser(
                self.current_token.position,
                "Condition must be a binding",
            ))
        }
    }

    fn parse_loop(&mut self) -> Result<Node> {
        self.consume_tag("for")?;
        let _item = self.expect_identifier()?;
        self.consume_token(&TokenType::Identifier("in".to_string()))?;
        let iterable = self.parse_attribute_value()?;
        self.consume_token(&TokenType::TagClose)?;

        let children = self.parse_children(&["for"])?;
        self.consume_end_tag("for")?;

        if let AttributeValue::Binding(binding) = iterable {
            Ok(Node::Loop {
                iterable: binding,
                item_name: _item,
                children,
            })
        } else {
            Err(ParseError::new_parser(
                self.current_token.position,
                "Loop iterable must be a binding",
            ))
        }
    }

    // Helper methods
    fn advance(&mut self) -> Result<()> {
        self.current_token = self.lexer.next_token()?;
        Ok(())
    }

    fn is_eof(&self) -> bool {
        matches!(self.current_token.token_type, TokenType::Eof)
    }

    fn match_token(&self, token_type: &TokenType) -> bool {
        std::mem::discriminant(&self.current_token.token_type)
            == std::mem::discriminant(token_type)
    }

    fn match_tag(&self, tag_name: &str) -> bool {
        matches!(self.current_token.token_type, TokenType::TagOpen)
            && matches!(self.peek_next(), Ok(t) if matches!(&t.token_type, TokenType::Identifier(name) if name == tag_name))
    }

    fn match_end_tag(&self, tag_name: &str) -> bool {
        matches!(self.current_token.token_type, TokenType::EndTag)
            && matches!(self.peek_next(), Ok(t) if matches!(&t.token_type, TokenType::Identifier(name) if name == tag_name))
    }

    fn consume_token(&mut self, token_type: &TokenType) -> Result<()> {
        if self.match_token(token_type) {
            self.advance()
        } else {
            Err(ParseError::new_parser(
                self.current_token.position,
                format!("Expected {:?}", token_type),
            ))
        }
    }

    fn consume_tag(&mut self, tag_name: &str) -> Result<()> {
        self.consume_token(&TokenType::TagOpen)?;
        let name = self.expect_identifier()?;
        if name != tag_name {
            return Err(ParseError::new_parser(
                self.current_token.position,
                format!("Expected tag '{}'", tag_name),
            ));
        }
        Ok(())
    }

    fn consume_end_tag(&mut self, tag_name: &str) -> Result<()> {
        self.consume_token(&TokenType::EndTag)?;
        let name = self.expect_identifier()?;
        if name != tag_name {
            return Err(ParseError::new_parser(
                self.current_token.position,
                format!("Expected end tag '{}'", tag_name),
            ));
        }
        self.consume_token(&TokenType::TagClose)?;
        Ok(())
    }

    fn expect_identifier(&mut self) -> Result<String> {
        if let TokenType::Identifier(name) = &self.current_token.token_type {
            let result = name.clone();
            self.advance()?;
            Ok(result)
        } else {
            Err(ParseError::new_parser(
                self.current_token.position,
                "Expected identifier",
            ))
        }
    }

    fn expect_string(&mut self) -> Result<String> {
        if let TokenType::String(s) = &self.current_token.token_type {
            let result = s.clone();
            self.advance()?;
            Ok(result)
        } else {
            Err(ParseError::new_parser(
                self.current_token.position,
                "Expected string",
            ))
        }
    }

    fn peek_next(&self) -> Result<Token> {
        // In a real implementation, we'd need a proper peek mechanism
        // For now, this is a placeholder
        Ok(self.current_token.clone())
    }

    fn current_token_to_string(&self) -> String {
        match &self.current_token.token_type {
            TokenType::Identifier(s) => s.clone(),
            TokenType::String(s) => format!("\"{}\"", s),
            TokenType::Number(n) => n.clone(),
            _ => String::new(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_empty_app() {
        let input = "<app></app>";
        let lexer = Lexer::new(input);
        let mut parser = Parser::new(lexer);
        let result = parser.parse_program();
        assert!(result.is_ok());
    }
}
