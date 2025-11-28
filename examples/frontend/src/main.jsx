
import { createRoot } from 'react-dom/client'
import './index.css'
import { FetchSmartProvider, FetchSmartDevtools } from 'use-fetch-smart'
import App from './App.jsx'

import { useAuth, AuthProvider } from './context/AuthContext.jsx';

export function Providers() {
  const { accessToken, refreshToken } = useAuth();

  return (
    <FetchSmartProvider
      config={{
        baseURL: "http://localhost:3000",
        token: accessToken,
        retryLimit: 3,
        refreshToken
      }}
    >
      <App />
      <FetchSmartDevtools />
    </FetchSmartProvider>
  );
}





createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Providers />
  </AuthProvider>
)
