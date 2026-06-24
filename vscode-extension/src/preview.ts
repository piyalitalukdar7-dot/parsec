import * as vscode from 'vscode';

export class PreviewManager {
  private panel: vscode.WebviewPanel | undefined;
  private backendUrl: string;
  private autoRefresh: boolean;
  private currentDocument: vscode.TextDocument | undefined;

  constructor(private context: vscode.ExtensionContext) {
    this.backendUrl = vscode.workspace
      .getConfiguration('parsec')
      .get('backendUrl', 'http://localhost:8000');
    this.autoRefresh = vscode.workspace
      .getConfiguration('parsec')
      .get('autoRefresh', true);
  }

  public openPreview(document: vscode.TextDocument): void {
    this.currentDocument = document;

    if (this.panel) {
      this.panel.reveal(vscode.ViewColumn.Beside);
    } else {
      this.panel = vscode.window.createWebviewPanel(
        'parsecPreview',
        'PARSEC Preview',
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.joinPath(this.context.extensionUri, 'dist'),
            vscode.Uri.joinPath(this.context.extensionUri, 'media'),
          ],
        }
      );

      this.panel.onDidDispose(() => {
        this.panel = undefined;
      });

      this.panel.onDidChangeViewState(() => {
        if (this.panel?.visible) {
          this.updatePreview();
        }
      });
    }

    this.updatePreview();
  }

  public togglePreview(): void {
    if (this.panel) {
      this.panel.dispose();
      this.panel = undefined;
    } else {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document.languageId === 'parsec') {
        this.openPreview(editor.document);
      }
    }
  }

  public updatePreview(): void {
    if (!this.panel || !this.currentDocument) {
      return;
    }

    const content = this.currentDocument.getText();
    this.panel.webview.html = this.getWebviewContent(content);
  }

  public setBackendUrl(url: string): void {
    this.backendUrl = url;
    vscode.workspace.getConfiguration('parsec').update('backendUrl', url, vscode.ConfigurationTarget.Global);
    this.updatePreview();
  }

  private getWebviewContent(parsecCode: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PARSEC Preview</title>
        <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
        <style>
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
          }
          
          .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-size: 18px;
            color: var(--vscode-editor-foreground);
          }
          
          .error {
            padding: 20px;
            background-color: var(--vscode-inputValidation-errorBackground);
            color: var(--vscode-inputValidation-errorForeground);
            border-radius: 4px;
            border: 1px solid var(--vscode-inputValidation-errorBorder);
            font-family: 'Courier New', monospace;
            white-space: pre-wrap;
            word-break: break-word;
          }
          
          .error-title {
            font-weight: bold;
            margin-bottom: 10px;
          }
          
          .app-container {
            max-width: 1200px;
            margin: 0 auto;
          }
          
          /* PARSEC Component Styles */
          [data-parsec-stack] {
            display: flex;
          }
          
          [data-parsec-stack][data-vertical="true"] {
            flex-direction: column;
          }
          
          [data-parsec-grid] {
            display: grid;
          }
          
          [data-parsec-text] {
            display: block;
          }
          
          [data-parsec-button] {
            padding: 10px 16px;
            border: none;
            border-radius: 4px;
            background-color: #0078d4;
            color: white;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          }
          
          [data-parsec-button]:hover {
            background-color: #106ebe;
          }
          
          [data-parsec-button]:active {
            background-color: #005a9e;
          }
          
          [data-parsec-input],
          [data-parsec-checkbox],
          [data-parsec-select] {
            padding: 8px 12px;
            border: 1px solid #d0d0d0;
            border-radius: 4px;
            font-size: 14px;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
          }
          
          [data-parsec-card] {
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 16px;
            background-color: var(--vscode-editor-background);
          }
        </style>
      </head>
      <body>
        <div id="app" class="app-container">
          <div class="loading">Starting PARSEC preview...</div>
        </div>
        
        <script>
          // Simple PARSEC parser for basic rendering
          class ParsecRenderer {
            constructor(code, backendUrl) {
              this.code = code;
              this.backendUrl = backendUrl;
              this.state = {};
              this.init();
            }
            
            async init() {
              try {
                // Fetch initial state from backend
                const response = await fetch(this.backendUrl + '/state');
                if (!response.ok) {
                  throw new Error(\`Backend error: \${response.status} \${response.statusText}\`);
                }
                this.state = await response.json();
                this.render();
              } catch (error) {
                this.showError('Backend Connection Error', error.message + '\\n\\nMake sure your backend is running at: ' + this.backendUrl);
              }
            }
            
            render() {
              const html = this.parseAndRender(this.code);
              document.getElementById('app').innerHTML = html;
              this.attachEventHandlers();
            }
            
            parseAndRender(code) {
              try {
                // Simple regex-based PARSEC parser for quick preview
                let html = '';
                const lines = code.split('\\n');
                
                for (let line of lines) {
                  line = line.trim();
                  if (!line || line.startsWith('<!--')) continue;
                  
                  // Handle different tags
                  if (line.startsWith('<text')) {
                    html += this.parseText(line);
                  } else if (line.startsWith('<button')) {
                    html += this.parseButton(line);
                  } else if (line.startsWith('<input')) {
                    html += this.parseInput(line);
                  } else if (line.startsWith('<stack')) {
                    html += this.parseStack(line);
                  } else if (line.startsWith('<card')) {
                    html += this.parseCard(line);
                  }
                }
                
                return html || '<p style="color: var(--vscode-editor-foreground);">No renderable content found</p>';
              } catch (error) {
                this.showError('Render Error', error.message);
                return '';
              }
            }
            
            parseText(line) {
              const contentMatch = line.match(/>([^<]+)</);
              let content = contentMatch ? contentMatch[1] : '';
              content = this.evaluateBinding(content);
              return \`<div data-parsec-text>\${content}</div>\`;
            }
            
            parseButton(line) {
              const match = line.match(/onClick="([^"]+)"/);
              const action = match ? match[1] : 'unknown';
              const contentMatch = line.match(/>([^<]+)</);
              const content = contentMatch ? contentMatch[1] : 'Button';
              return \`<button data-parsec-button data-action="\${action}">\${content}</button>\`;
            }
            
            parseInput(line) {
              const placeholderMatch = line.match(/placeholder="([^"]+)"/);
              const placeholder = placeholderMatch ? placeholderMatch[1] : 'Enter text...';
              return \`<input data-parsec-input type="text" placeholder="\${placeholder}" />\`;
            }
            
            parseStack(line) {
              const verticalMatch = line.match(/vertical/);
              const direction = verticalMatch ? 'column' : 'row';
              return \`<div data-parsec-stack style="flex-direction: \${direction}; gap: 16px;"></div>\`;
            }
            
            parseCard(line) {
              return '<div data-parsec-card></div>';
            }
            
            evaluateBinding(text) {
              // Replace {state.fieldName} with actual values
              return text.replace(/\\{state\\.([\\w.]+)\\}/g, (match, field) => {
                let value = this.state;
                for (let key of field.split('.')) {
                  value = value[key];
                  if (value === undefined) return match;
                }
                return value;
              });
            }
            
            attachEventHandlers() {
              document.querySelectorAll('[data-parsec-button]').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                  const action = e.target.dataset.action;
                  try {
                    const response = await fetch(this.backendUrl + '/actions/' + action, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({})
                    });
                    if (!response.ok) throw new Error(\`Action failed: \${response.statusText}\`);
                    const data = await response.json();
                    this.state = data.state || this.state;
                    this.render();
                  } catch (error) {
                    this.showError('Action Error', error.message);
                  }
                });
              });
            }
            
            showError(title, message) {
              document.getElementById('app').innerHTML = 
                \`<div class="error"><div class="error-title">\${title}</div>\${message}</div>\`;
            }
          }
          
          // Initialize renderer when page loads
          window.addEventListener('load', () => {
            const parsecCode = \`${this.escapeBackticks(parsecCode)}\`;
            const backendUrl = '${this.backendUrl}';
            new ParsecRenderer(parsecCode, backendUrl);
          });
        </script>
      </body>
      </html>
    `;
  }

  private escapeBackticks(text: string): string {
    return text.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  }
}
