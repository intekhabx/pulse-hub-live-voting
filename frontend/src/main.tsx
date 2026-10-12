import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ContextApiProvider from './Context/ContextApi.tsx'
import { Toaster } from 'react-hot-toast'
import PollContextProvider from './Context/PollContext.tsx'
import PollCreationContextProvider from './Context/PollCreationContext.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContextApiProvider>
      <PollContextProvider>
        <PollCreationContextProvider>
          <App />
          <Toaster />
        </PollCreationContextProvider>
      </PollContextProvider>
    </ContextApiProvider>
  </StrictMode>,
)
