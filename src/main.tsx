import './core/bootstrap';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import 'flag-icons/css/flag-icons.min.css';
import './index.css';

// Intercept benign ResizeObserver loop errors that occur when measuring during animation/layout changes
if (typeof window !== 'undefined') {
  const isResizeObserverError = (val?: unknown) => {
    if (!val) return false;
    const str = typeof val === 'string' ? val : (val as any)?.message || String(val);
    return (
      str.includes('ResizeObserver loop completed with undelivered notifications') ||
      str.includes('ResizeObserver loop limit exceeded') ||
      str.includes('ResizeObserver loop')
    );
  };

  // Capture phase listener
  window.addEventListener(
    'error',
    (event) => {
      if (isResizeObserverError(event.message) || isResizeObserverError(event.error)) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    },
    true
  );

  // Bubble phase listener
  window.addEventListener('error', (event) => {
    if (isResizeObserverError(event.message) || isResizeObserverError(event.error)) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  });

  // Global window.onerror fallback
  const prevOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (isResizeObserverError(message) || isResizeObserverError(error)) {
      return true;
    }
    if (typeof prevOnError === 'function') {
      return prevOnError(message, source, lineno, colno, error);
    }
    return false;
  };

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      if (isResizeObserverError(event.reason?.message) || isResizeObserverError(event.reason)) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    },
    true
  );
}

createRoot(document.getElementById('root')!).render(<App />);
