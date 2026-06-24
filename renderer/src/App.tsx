import React, { useState, useEffect } from 'react';
import { Program } from './ast';
import { renderNodes, RenderContext } from './render';

interface AppProps {
  program: Program;
  backendUrl?: string;
}

export const App: React.FC<AppProps> = ({ program, backendUrl = 'http://localhost:8000' }) => {
  const [state, setState] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Failed to fetch state:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchState();
  }, [backendUrl]);

  const handleAction = async (actionName: string, data?: any) => {
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
    } catch (err) {
      console.error(`Action failed: ${actionName}`, err);
      setError(err instanceof Error ? err.message : 'Action failed');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif', color: 'red' }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!program.app) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <p>No app defined in PARSEC program</p>
      </div>
    );
  }

  const context: RenderContext = {
    state,
    onAction: handleAction,
  };

  // Render all views
  const viewsHtml = program.app.views
    .map((view) => renderNodes(view.children, context))
    .join('');

  return (
    <div
      dangerouslySetInnerHTML={{ __html: viewsHtml }}
      style={{ fontFamily: 'sans-serif' }}
    />
  );
};

export default App;
