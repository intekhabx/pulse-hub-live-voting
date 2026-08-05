import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ContextApiProvider from './Context/ContextApi.tsx'
import { Toaster } from 'react-hot-toast'
import PollContextProvider from './Context/PollContext.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContextApiProvider>
      <PollContextProvider>
        <App />
        <Toaster />
      </PollContextProvider>
    </ContextApiProvider>
  </StrictMode>,
)
