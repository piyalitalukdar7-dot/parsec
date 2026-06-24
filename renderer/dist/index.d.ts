export * from './ast';
export * from './render';
export { App } from './App';
import { Program } from './ast';
/**
 * Initialize the PARSEC renderer with a parsed program
 */
export declare function initializeParsecApp(rootElement: HTMLElement, program: Program, backendUrl?: string): void;
declare global {
    interface Window {
        ParsecApp?: {
            initialize: typeof initializeParsecApp;
        };
    }
}
