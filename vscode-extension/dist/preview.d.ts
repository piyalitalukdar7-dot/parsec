import * as vscode from 'vscode';
export declare class PreviewManager {
    private context;
    private panel;
    private backendUrl;
    private autoRefresh;
    private currentDocument;
    constructor(context: vscode.ExtensionContext);
    openPreview(document: vscode.TextDocument): void;
    togglePreview(): void;
    updatePreview(): void;
    setBackendUrl(url: string): void;
    private getWebviewContent;
    private escapeBackticks;
}
//# sourceMappingURL=preview.d.ts.map