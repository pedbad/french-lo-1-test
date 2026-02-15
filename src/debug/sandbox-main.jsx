import '../styles/fonts.css';
import '../index.css';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DebugSandbox } from './DebugSandbox';

if (!import.meta.env.DEV) {
	throw new Error('Debug sandbox is development-only and must not be bundled into production output.');
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
