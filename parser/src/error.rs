use thiserror::Error;

pub type Result<T> = std::result::Result<T, ParseError>;

#[derive(Error, Debug, Clone)]
pub enum ParseError {
    #[error("Lexer error at position {position}: {message}")]
    LexerError { position: usize, message: String },

    #[error("Parser error at position {position}: {message}")]
    ParserError { position: usize, message: String },

    #[error("Unexpected token: expected {expected}, got {got}")]
    UnexpectedToken { expected: String, got: String },

    #[error("Unexpected end of input")]
    UnexpectedEof,

    #[error("Invalid attribute: {0}")]
    InvalidAttribute(String),

    #[error("Invalid binding: {0}")]
    InvalidBinding(String),

    #[error("Duplicate attribute: {0}")]
    DuplicateAttribute(String),

    #[error("Validation error: {0}")]
    ValidationError(String),
}

impl ParseError {
    pub fn new_lexer(position: usize, message: impl Into<String>) -> Self {
        ParseError::LexerError {
            position,
            message: message.into(),
        }
    }

    pub fn new_parser(position: usize, message: impl Into<String>) -> Self {
        ParseError::ParserError {
            position,
            message: message.into(),
        }
    }
}
