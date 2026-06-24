# PARSEC VS Code Extension

Live preview and development tools for PARSEC apps directly in VS Code.

## Features

- **Live Preview** — Real-time rendering as you type
- **Hot Reload** — Auto-connect to backend during development
- **Syntax Highlighting** — PARSEC-specific syntax coloring
- **Error Reporting** — Clear parse error messages
- **Viewport Switcher** — Test mobile (375px), tablet (768px), desktop (1440px)
- **Inspector** — Click elements to see state/props
- **Device Frames** — Optional phone bezel for screenshots

## Installation

### From Source

```bash
cd vscode-extension
npm install
npm run build
npm run vscode:prepublish
```

### From Marketplace

_Coming soon_

## Usage

### Open Preview

1. Open a `.parsec` file
2. Run command: `PARSEC: Open Preview` (Ctrl+Shift+P)
3. Preview opens in side panel

### Set Backend URL

1. Run command: `PARSEC: Set Backend URL`
2. Enter backend address: `http://localhost:8000`
3. (Or set in VS Code settings under `parsec.backendUrl`)

### Auto-Refresh

Enable in settings:
```json
{
  "parsec.autoRefresh": true
}
```

Preview updates automatically when you save the file.

### Keyboard Shortcuts

- `Ctrl+Shift+P` — Open preview (when in `.parsec` file)
- `Cmd+S` — Save and refresh (auto if enabled)

## Extension Structure

### `extension.ts`

Main entry point:
- Registers commands
- Manages activation events
- Handles document changes

### `preview.ts`

Preview manager:
- Creates/manages webview
- Updates preview on file changes
- Communicates with backend
- Handles configuration changes

## Configuration

Settings in VS Code:

```json
{
  "parsec.backendUrl": "http://localhost:8000",
  "parsec.autoRefresh": true,
  "parsec.deviceFrames": false
}
```

## Architecture

```
VS Code Editor
    ↓
Document Change
    ↓
PreviewManager
    ↓
Webview Panel
    ↓
PARSEC Parser (Rust WASM)
    ↓
PARSEC Renderer (React)
    ↓
HTML Preview
```

The extension:
1. Reads `.parsec` file content
2. Parses with Rust parser (compiled to WASM)
3. Renders with TypeScript renderer
4. Displays in webview
5. Connects to backend for state/actions

## Building

### Development

```bash
npm install
npm run watch
```

Starts TypeScript compiler in watch mode.

### Release

```bash
npm run vscode:prepublish
npm run build
```

Produces compiled extension in `dist/`.

## Testing

```bash
npm test
```

Tests cover:
- Command registration
- Preview lifecycle
- File change handling
- Configuration updates

## Debugging

1. Open VS Code in debug mode: `code --extensionDevelopmentPath=.`
2. Press F5 to launch extension host
3. Open `.parsec` file to test
4. Use browser DevTools (F12) on webview

## Features in Development

- [ ] Viewport switcher UI
- [ ] Device frames (phone bezel)
- [ ] Inspector (click elements to inspect)
- [ ] State/props viewer
- [ ] Error panel with suggestions
- [ ] Live reload socket connection
- [ ] Performance profiler
- [ ] Code generation from UI mockups

## Performance Tips

- Large files (>10KB) may have slower preview updates
- Keep backend at `localhost` for faster responses
- Disable device frames if performance is slow

## Troubleshooting

**Preview not showing?**
- Check backend URL in settings
- Verify backend is running: `curl http://localhost:8000/state`
- Check VS Code Output panel for errors

**Preview shows parse errors?**
- Check PARSEC syntax in your `.parsec` file
- Open VS Code Output: `View → Output`
- Look for `PARSEC` channel

**Backend connection failed?**
- Ensure backend is running
- Check CORS is enabled on backend
- Try setting backend URL again

## Contributing

Contributions welcome! See main [CONTRIBUTING.md](../CONTRIBUTING.md).

## Future

- Native iOS/Android preview
- Remote device preview
- Collaboration features
- Component marketplace
