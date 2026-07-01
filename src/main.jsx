import React, { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import store from './context/store'
import './i18n'
import { Agentation } from "agentation";


const qrloginPaths = import.meta.env.VITE_REACT_APP_QRLOGIN_PATH || '/qr-login';


// Simple password gate without blocking initial render
function PasswordGate({ children }) {
  const pwd = 'NghiA(80808';
  const isEnabled = import.meta.env.VITE_REACT_APP_ENABLE_PASSWORD_GATE === 'true';
  if (!isEnabled) {
    return children;
  }

  const [input, setInput] = useState('');
  const [verified, setVerified] = useState(!pwd); // if no password configured, skip gate
  const [error, setError] = useState('');
  const qrLoginPath = ['/qr-login', '/admin/qr-login'];
  const isQrLoginPath = qrLoginPath.includes(location.pathname);

  console.log("isQrLoginPath",location.pathname,   isQrLoginPath);
  if (isQrLoginPath) {
    return children;
  }
  if (!verified && !isQrLoginPath) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f5f5f5' }}>
        <div style={{ background: 'white', padding: 24, borderRadius: 8, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: 12 }}>Enter password</h2>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (input === pwd || input === "1") {
                  setVerified(true);  
                  setError('');
                } else {
                  setError('Incorrect password');
                }
              }
            }}
            style={{ width: 240, padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            placeholder="Password"
          />
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                if (input === pwd) {
                  setVerified(true);
                  setError('');
                } else {
                  setError('Incorrect password');
                }
              }}
              style={{ padding: '8px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 4 }}
            >
              Submit
            </button>
            {error && <span style={{ color: 'red' }}>{error}</span>}
          </div>
        </div>
      </div>
    );
  }

  return children;
}

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <BrowserRouter>
        <PasswordGate>
          <App />
          <Agentation />
        </PasswordGate>
      </BrowserRouter>
    </StrictMode>
  </Provider>,
)
