import * as vscode from 'vscode';
import { PreviewManager } from './preview';

let previewManager: PreviewManager;

export function activate(context: vscode.ExtensionContext): void {
  console.log('PARSEC extension activated');

  previewManager = new PreviewManager(context);

  // Register commands
  const openPreviewCommand = vscode.commands.registerCommand('parsec.openPreview', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.languageId === 'parsec') {
      previewManager.openPreview(editor.document);
    } else {
      vscode.window.showWarningMessage('Please open a .parsec file first');
    }
  });

  const togglePreviewCommand = vscode.commands.registerCommand('parsec.togglePreview', () => {
    previewManager.togglePreview();
  });

  const setBackendUrlCommand = vscode.commands.registerCommand('parsec.setBackendUrl', async () => {
    const url = await vscode.window.showInputBox({
      prompt: 'Enter backend URL',
      value: vscode.workspace
        .getConfiguration('parsec')
        .get('backendUrl', 'http://localhost:8000'),
    });

    if (url) {
      previewManager.setBackendUrl(url);
      vscode.window.showInformationMessage(`Backend URL set to: ${url}`);
    }
  });

  // Show language reference for AI/developers
  const showLanguageRefCommand = vscode.commands.registerCommand('parsec.showLanguageReference', async () => {
    const refUri = vscode.Uri.joinPath(context.extensionUri, '..', '..', 'PARSEC_LANGUAGE_REFERENCE.md');
    const doc = await vscode.workspace.openTextDocument(refUri);
    await vscode.window.showTextDocument(doc);
  });

  // Show quick help
  const showHelpCommand = vscode.commands.registerCommand('parsec.showHelp', async () => {
    const guideUri = vscode.Uri.joinPath(context.extensionUri, '..', '..', 'AI_PROMPTING_GUIDE.md');
    const doc = await vscode.workspace.openTextDocument(guideUri);
    await vscode.window.showTextDocument(doc);
  });

  // Watch for document changes
  const docChangeListener = vscode.workspace.onDidChangeTextDocument((event) => {
    if (event.document.languageId === 'parsec') {
      previewManager.updatePreview();
    }
  });

  // Watch for active editor changes
  const editorChangeListener = vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor && editor.document.languageId === 'parsec') {
      previewManager.updatePreview();
    }
  });

  // Watch for configuration changes
  const configChangeListener = vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('parsec')) {
      const backendUrl = vscode.workspace
        .getConfiguration('parsec')
        .get('backendUrl', 'http://localhost:8000');
      previewManager.setBackendUrl(backendUrl);
    }
  });

  context.subscriptions.push(
    openPreviewCommand,
    togglePreviewCommand,
    setBackendUrlCommand,
    showLanguageRefCommand,
    showHelpCommand,
    docChangeListener,
    editorChangeListener,
    configChangeListener
  );
}

export function deactivate(): void {
  console.log('PARSEC extension deactivated');
}
