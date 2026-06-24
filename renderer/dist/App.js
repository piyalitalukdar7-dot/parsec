import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { renderNodes } from './render';
export const App = ({ program, backendUrl = 'http://localhost:8000' }) => {
    const [state, setState] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Fetch initial state from backend
    useEffect(() => {
        const fetchState = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${backendUrl}/state`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch state: ${response.statusText}`);
                }
                const data = await response.json();
                setState(data);
                setError(null);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                console.error('Failed to fetch state:', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchState();
    }, [backendUrl]);
    const handleAction = async (actionName, data) => {
        try {
            const response = await fetch(`${backendUrl}/actions/${actionName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data }),
            });
            if (!response.ok) {
                throw new Error(`Action failed: ${response.statusText}`);
            }
            const result = await response.json();
            if (result.state) {
                setState(result.state);
            }
        }
        catch (err) {
            console.error(`Action failed: ${actionName}`, err);
            setError(err instanceof Error ? err.message : 'Action failed');
        }
    };
    if (loading) {
        return (_jsx("div", { style: { padding: '20px', fontFamily: 'sans-serif' }, children: _jsx("p", { children: "Loading..." }) }));
    }
    if (error) {
        return (_jsx("div", { style: { padding: '20px', fontFamily: 'sans-serif', color: 'red' }, children: _jsxs("p", { children: ["Error: ", error] }) }));
    }
    if (!program.app) {
        return (_jsx("div", { style: { padding: '20px', fontFamily: 'sans-serif' }, children: _jsx("p", { children: "No app defined in PARSEC program" }) }));
    }
    const context = {
        state,
        onAction: handleAction,
    };
    // Render all views
    const viewsHtml = program.app.views
        .map((view) => renderNodes(view.children, context))
        .join('');
    return (_jsx("div", { dangerouslySetInnerHTML: { __html: viewsHtml }, style: { fontFamily: 'sans-serif' } }));
};
export default App;
