import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ToastProvider } from './hooks/useToast';
import { UsdDisplayProvider } from './hooks/useUsdDisplay';
import { initSentry } from './lib/monitoring';
import './styles/index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

// Env-gated: no-op unless VITE_SENTRY_DSN is configured.
void initSentry();

createRoot(root).render(
  <StrictMode>
    <ToastProvider>
      <UsdDisplayProvider>
        <App />
      </UsdDisplayProvider>
    </ToastProvider>
  </StrictMode>,
);
