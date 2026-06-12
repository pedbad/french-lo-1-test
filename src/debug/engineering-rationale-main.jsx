import '../index.css';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { EngineeringRationale } from './EngineeringRationale';

const isDebugBuildEnabled = import.meta.env.DEV || import.meta.env.VITE_INCLUDE_DEBUG === 'true';
if (!isDebugBuildEnabled) {
  throw new Error('Engineering rationale page is disabled. Rebuild with VITE_INCLUDE_DEBUG=true to include this page.');
}

const rootElement = document.getElementById('engineering-rationale-root');
if (!rootElement) {
  throw new Error('Missing #engineering-rationale-root element in engineering rationale page.');
}

createRoot(rootElement).render(
  <StrictMode>
    <EngineeringRationale />
  </StrictMode>
);
