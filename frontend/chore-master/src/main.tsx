import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './Components/App/App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const client_id: string = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

if (!client_id) {
  console.error('VITE_GOOGLE_CLIENT_ID environment variable is not set');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={client_id}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)