import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { FetchSmartProvider, FetchSmartDevtools } from 'use-fetch-smart'
import App from './App.jsx'

const refreshToken = async () => {
  const storedRefresh = localStorage.getItem("refreshToken");
  console.log("Stored refresh token:", storedRefresh);

  if (!storedRefresh) return null;

  return fetch("http://localhost:3000/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: storedRefresh })
  })
    .then(r => r.json())
    .then(data => {
      console.log("Data in refreshToken:", data);

      if (!data.accessToken) return null;

      // store new access token
      localStorage.setItem("accessToken", data.accessToken);
      return data.accessToken;
    })
    .catch(() => null);
};


createRoot(document.getElementById('root')).render(
  <FetchSmartProvider
    config={{
      baseURL: "http://localhost:3000",
      token: localStorage.getItem("accessToken"),
      retryLimit: 3,
      refreshToken
    }}
  >
    <App />
    <FetchSmartDevtools />
  </FetchSmartProvider>
)
