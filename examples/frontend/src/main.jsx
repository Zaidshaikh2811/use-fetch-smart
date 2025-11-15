
import { createRoot } from 'react-dom/client'
import './index.css'
import { FetchSmartProvider, FetchSmartDevtools } from 'use-fetch-smart'
import App from './App.jsx'

let ACCESS_TOKEN = null;

// Function given to use-fetch-smart to get current token
const getToken = () => ACCESS_TOKEN;

const refreshToken = async () => {
  const storedRefresh = localStorage.getItem("refreshToken");



  return fetch("http://localhost:3000/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: storedRefresh })
  })
    .then(r => r.json())
    .then(data => {

      if (!data.accessToken) return null;

      ACCESS_TOKEN = data.accessToken;
      return ACCESS_TOKEN;
    })
    .catch(() => null);
};

export const setAccessToken = (token) => {
  ACCESS_TOKEN = token;
}


createRoot(document.getElementById('root')).render(
  <FetchSmartProvider
    config={{
      baseURL: "http://localhost:3000",
      token: getToken(),
      retryLimit: 3,
      refreshToken
    }}
  >
    <App />
    <FetchSmartDevtools />
  </FetchSmartProvider>
)
