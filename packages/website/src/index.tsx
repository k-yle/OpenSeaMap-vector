import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import 'maplibre-gl/dist/maplibre-gl.css';
import './index.css';

const root = createRoot(document.querySelector('main')!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
