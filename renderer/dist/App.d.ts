import React from 'react';
import { Program } from './ast';
interface AppProps {
    program: Program;
    backendUrl?: string;
}
export declare const App: React.FC<AppProps>;
export default App;
