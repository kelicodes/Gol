import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ShopContextProvider } from './Context/ShopContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ShopContextProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </ShopContextProvider>
  </BrowserRouter>
)
