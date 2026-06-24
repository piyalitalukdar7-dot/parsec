export * from './ast';
export * from './render';
export { App } from './App';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Program } from './ast';

/**
 * Initialize the PARSEC renderer with a parsed program
 */
export function initializeParsecApp(
  rootElement: HTMLElement,
  program: Program,
  backendUrl?: string
) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App program={program} backendUrl={backendUrl} />);
}

declare global {
  interface Window {
    ParsecApp?: {
      initialize: typeof initializeParsecApp;
    };
  }
}

if (typeof window !== 'undefined') {
  window.ParsecApp = {
    initialize: initializeParsecApp,
  };
}
