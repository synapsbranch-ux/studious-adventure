import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { HashRouter } from 'react-router-dom'

// --- DÉBUT CONFIGURATION AMPLIFY ---
import { Amplify } from 'aws-amplify';
// Importe la config générée par "npx ampx sandbox"
import outputs from '../amplify_outputs.json'; 

Amplify.configure(outputs);
// --- FIN CONFIGURATION AMPLIFY ---

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
