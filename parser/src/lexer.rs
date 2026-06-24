use crate::error::{ParseError, Result};

#[derive(Debug, Clone, PartialEq)]
pub enum TokenType {
    // Structural
    TagOpen,              // <
    TagClose,             // >
    TagSelfClose,         // />
    EndTag,               // </
    
    // Identifiers and values
    Identifier(String),
    String(String),
    Number(String),
    
    // Operators and special
    Equals,                // =
    Dot,                   // .
    Colon,                 // :
    Comma,                 // ,
    Pipe,                  // |
    Question,              // ?
    At,                    // @
    
    // Bindings
    BindingStart,          // {
    BindingEnd,            // }
    
    // Whitespace and EOF
    Whitespace,
    Eof,
}

#[derive(Debug, Clone)]
pub struct Token {
    pub token_type: TokenType,
    pub position: usize,
    pub length: usize,
}

pub struct Lexer {
    input: Vec<char>,
    position: usize,
}

impl Lexer {
    pub fn new(input: &str) -> Self {
        Lexer {
            input: input.chars().collect(),
            position: 0,
        }
    }

    pub fn next_token(&mut self) -> Result<Token> {
        self.skip_whitespace();

        if self.is_eof() {
            return Ok(Token {
                token_type: TokenType::Eof,
                position: self.position,
                length: 0,
            });
        }

        let start_pos = self.position;
        let ch = self.current_char().unwrap();

        let token_type = match ch {
            '<' => {
                self.advance();
                if self.current_char() == Some('/') {
                    self.advance();
                    TokenType::EndTag
                } else {
                    TokenType::TagOpen
                }
            }
            '>' => {
                self.advance();
                TokenType::TagClose
            }
            '/' => {
                self.advance();
                if self.current_char() == Some('>') {
                    self.advance();
                    TokenType::TagSelfClose
                } else {
                    return Err(ParseError::new_lexer(self.position, "Unexpected '/'"));
                }
            }
            '=' => {
                self.advance();
                TokenType::Equals
            }
            '{' => {
                self.advance();
                TokenType::BindingStart
            }
            '}' => {
                self.advance();
                TokenType::BindingEnd
            }
            '"' | '\'' => self.read_string()?,
            '0'..='9' => self.read_number(),
            'a'..='z' | 'A'..='Z' | '_' | '-' => self.read_identifier(),
            '.' => {
                self.advance();
                TokenType::Dot
            }
            ':' => {
                self.advance();
                TokenType::Colon
            }
            ',' => {
                self.advance();
                TokenType::Comma
            }
            '|' => {
                self.advance();
                TokenType::Pipe
            }
            '?' => {
                self.advance();
                TokenType::Question
            }
            '@' => {
                self.advance();
                TokenType::At
            }
            _ => {
                return Err(ParseError::new_lexer(
                    self.position,
                    format!("Unexpected character: '{}'", ch),
                ))
            }
        };

        Ok(Token {
            token_type,
            position: start_pos,
            length: self.position - start_pos,
        })
    }

    fn read_string(&mut self) -> Result<TokenType> {
        let quote = self.current_char().unwrap();
        self.advance();

        let mut result = String::new();
        while !self.is_eof() && self.current_char() != Some(quote) {
            if self.current_char() == Some('\\') {
                self.advance();
                match self.current_char() {
                    Some('n') => result.push('\n'),
                    Some('t') => result.push('\t'),
                    Some('\\') => result.push('\\'),
                    Some('"') => result.push('"'),
                    Some('\'') => result.push('\''),
                    _ => result.push(self.current_char().unwrap_or('?')),
                }
                self.advance();
            } else {
                result.push(self.current_char().unwrap());
                self.advance();
            }
        }

        if self.is_eof() {
            return Err(ParseError::new_lexer(
                self.position,
                "Unterminated string",
            ));
        }

        self.advance(); // closing quote
        Ok(TokenType::String(result))
    }

    fn read_number(&mut self) -> TokenType {
        let mut result = String::new();
        while !self.is_eof() && self.current_char().map_or(false, |c| c.is_ascii_digit() || c == '.') {
            result.push(self.current_char().unwrap());
            self.advance();
        }
        TokenType::Number(result)
    }

    fn read_identifier(&mut self) -> TokenType {
        let mut result = String::new();
        while !self.is_eof() && self.current_char().map_or(false, |c| {
            c.is_ascii_alphanumeric() || c == '_' || c == '-'
        }) {
            result.push(self.current_char().unwrap());
            self.advance();
        }
        TokenType::Identifier(result)
    }

    fn skip_whitespace(&mut self) {
        while !self.is_eof() && self.current_char().map_or(false, |c| c.is_whitespace()) {
            self.advance();
        }
    }

    fn current_char(&self) -> Option<char> {
        if self.position < self.input.len() {
            Some(self.input[self.position])
        } else {
            None
        }
    }

    fn advance(&mut self) {
        self.position += 1;
    }

    fn is_eof(&self) -> bool {
        self.position >= self.input.len()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_simple_tag() {
        let mut lexer = Lexer::new("<text>");
        let token1 = lexer.next_token().unwrap();
        assert_eq!(token1.token_type, TokenType::TagOpen);

        let token2 = lexer.next_token().unwrap();
        match &token2.token_type {
            TokenType::Identifier(s) => assert_eq!(s, "text"),
            _ => panic!("Expected identifier"),
        }

        let token3 = lexer.next_token().unwrap();
        assert_eq!(token3.token_type, TokenType::TagClose);
    }

    #[test]
    fn test_string_parsing() {
        let mut lexer = Lexer::new(r#""hello world""#);
        let token = lexer.next_token().unwrap();
        match token.token_type {
            TokenType::String(s) => assert_eq!(s, "hello world"),
            _ => panic!("Expected string"),
        }
    }
}
