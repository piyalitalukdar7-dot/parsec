import { jsx as _jsx } from "react/jsx-runtime";
export * from './ast';
export * from './render';
export { App } from './App';
import ReactDOM from 'react-dom/client';
import App from './App';
/**
 * Initialize the PARSEC renderer with a parsed program
 */
export function initializeParsecApp(rootElement, program, backendUrl) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(_jsx(App, { program: program, backendUrl: backendUrl }));
}
if (typeof window !== 'undefined') {
    window.ParsecApp = {
        initialize: initializeParsecApp,
    };
}
