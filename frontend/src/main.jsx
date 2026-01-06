import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; 

// 1. IMPORT THIS
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);