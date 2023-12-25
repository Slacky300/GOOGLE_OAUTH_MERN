import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/authContext.jsx'
import { UpdateProvider } from './context/hasUpdated.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <UpdateProvider>
        <App />
      </UpdateProvider>
    </AuthProvider>
  </React.StrictMode>,
)
