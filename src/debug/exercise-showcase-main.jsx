import '../index.css';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExerciseShowcase } from './ExerciseShowcase';

const isDebugBuildEnabled = import.meta.env.DEV || import.meta.env.VITE_INCLUDE_DEBUG === 'true';
if (!isDebugBuildEnabled) {
  throw new Error('Exercise showcase is disabled. Rebuild with VITE_INCLUDE_DEBUG=true to include this page.');
}

const rootElement = document.getElementById('exercise-showcase-root');
if (!rootElement) {
  throw new Error('Missing #exercise-showcase-root element in exercise showcase page.');
}

createRoot(rootElement).render(
  <StrictMode>
    <ExerciseShowcase />
  </StrictMode>
);
