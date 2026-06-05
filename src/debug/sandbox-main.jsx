import '../index.css';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DebugSandbox } from './DebugSandbox';

const isDebugBuildEnabled = import.meta.env.DEV || import.meta.env.VITE_INCLUDE_DEBUG === 'true';
if (!isDebugBuildEnabled) {
  throw new Error('Debug sandbox build is disabled. Rebuild with VITE_INCLUDE_DEBUG=true to include this page.');
}

const rootElement = document.getElementById('debug-sandbox-root');
if (!rootElement) {
  throw new Error('Missing #debug-sandbox-root element in debug sandbox page.');
}

createRoot(rootElement).render(
  <StrictMode>
    <DebugSandbox />
  </StrictMode>
);
