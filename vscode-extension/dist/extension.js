"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const preview_1 = require("./preview");
let previewManager;
function activate(context) {
    console.log('PARSEC extension activated');
    previewManager = new preview_1.PreviewManager(context);
    // Register commands
    const openPreviewCommand = vscode.commands.registerCommand('parsec.openPreview', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'parsec') {
            previewManager.openPreview(editor.document);
        }
        else {
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
    context.subscriptions.push(openPreviewCommand, togglePreviewCommand, setBackendUrlCommand, showLanguageRefCommand, showHelpCommand, docChangeListener, editorChangeListener, configChangeListener);
}
function deactivate() {
    console.log('PARSEC extension deactivated');
}
//# sourceMappingURL=extension.js.map