import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Error boundary to catch render errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: '#f1f5f9',
          minHeight: '100vh'
        }}>
          <h1 style={{ color: '#dc2626' }}>Something went wrong</h1>
          <p style={{ color: '#64748b' }}>The application failed to load. Please check the browser console for details.</p>
          <pre style={{
            backgroundColor: '#1e293b',
            color: '#f8fafc',
            padding: '16px',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '14px'
          }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  document.body.innerHTML = '<div style="padding: 20px; color: red;">Could not find root element to mount to</div>';
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render React app:', error);
  rootElement.innerHTML = `<div style="padding: 20px; font-family: system-ui; background: #f1f5f9; min-height: 100vh;">
    <h1 style="color: #dc2626;">Application Failed to Load</h1>
    <p style="color: #64748b;">Error: ${error instanceof Error ? error.message : String(error)}</p>
  </div>`;
}