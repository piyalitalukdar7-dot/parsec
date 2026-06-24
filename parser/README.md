# PARSEC Parser

A Rust-based parser for the PARSEC markup language.

## Features

- **Fast** — Compiled Rust with zero-copy parsing
- **WASM** — Compiles to WebAssembly for browser use
- **Accurate** — Fully validates PARSEC syntax
- **Clear errors** — Helpful error messages with positions

## Architecture

```
Input (PARSEC markup)
    ↓
Lexer (tokenize)
    ↓
Parser (build AST)
    ↓
Output (AST JSON)
```

### Lexer (`lexer.rs`)

Tokenizes PARSEC markup into tokens:
- Tags: `<tag>`, `</tag>`, `/>`
- Identifiers: `text`, `button`, etc.
- Strings: `"hello"`, `'world'`
- Bindings: `{expression}`
- Operators: `=`, `.`, `:`, etc.

### AST (`ast.rs`)

Abstract Syntax Tree types:
- `Program` — Root node
- `AppNode` — `<app>` element
- `ViewNode` — `<view>` elements
- `Node` — All content nodes (text, elements, components, loops, conditionals)
- `AttributeValue` — Attribute values (string, number, binding, etc.)

### Parser (`parser.rs`)

Recursive descent parser:
1. Parse program (imports, components, app)
2. Parse app (meta, views)
3. Parse views (children nodes)
4. Parse nodes (elements, text, bindings, loops, conditionals)
5. Parse attributes and bindings

## Usage

### As a Library

```rust
use parsec_parser::parse;

fn main() {
    let input = r#"
        <app>
          <meta title="Test" />
          <view>
            <text>Hello</text>
          </view>
        </app>
    "#;

    match parse(input) {
        Ok(program) => println!("{:#?}", program),
        Err(err) => eprintln!("Parse error: {}", err),
    }
}
```

### From CLI

```bash
cargo build --release
./target/release/parsec-cli input.parsec
```

## Building

### Native Binary

```bash
cargo build --release
./target/release/parsec-parser
```

### WebAssembly

```bash
cargo build --target wasm32-unknown-unknown --release
```

This produces `target/wasm32-unknown-unknown/release/parsec_parser.wasm`.

Use with `wasm-bindgen` to call from JavaScript.

## Testing

```bash
cargo test
```

Tests cover:
- Lexer tokenization
- Parser AST building
- Error handling

## Performance

- **Parse time**: < 1ms for typical apps
- **Binary size**: ~2MB (Rust debug), ~500KB (release), ~200KB (WASM)
- **Memory**: Minimal, streaming tokenization

## Error Handling

Parser returns `Result<Program, ParseError>` with detailed error info:

```rust
pub enum ParseError {
    LexerError { position, message },
    ParserError { position, message },
    UnexpectedToken { expected, got },
    UnexpectedEof,
    InvalidAttribute(String),
    DuplicateAttribute(String),
    // ...
}
```

## Future Improvements

- [ ] Streaming parser for large files
- [ ] Better error recovery
- [ ] Validator for semantic rules
- [ ] LSP support for IDE integration
