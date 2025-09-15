import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './Components/App/App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const client_id:string = '645864489229-sr19al0i4t5vkj1vsacfbvcnlfebvds6.apps.googleusercontent.com';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={client_id}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
