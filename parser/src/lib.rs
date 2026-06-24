pub mod lexer;
pub mod ast;
pub mod parser;
pub mod error;

pub use lexer::Lexer;
pub use parser::Parser;
pub use ast::*;
pub use error::{ParseError, Result};

/// Parse a PARSEC document into an AST
pub fn parse(input: &str) -> Result<Program> {
    let lexer = Lexer::new(input);
    let mut parser = Parser::new(lexer);
    parser.parse_program()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_parse() {
        let input = r#"
            <app>
              <meta title="Test App" />
              <view>
                <text>Hello World</text>
              </view>
            </app>
        "#;
        let result = parse(input);
        assert!(result.is_ok());
    }
}
