import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ContextApiProvider from './Context/ContextApi.tsx'
import { Toaster } from 'react-hot-toast'
import PollContextProvider from './Context/PollContext.tsx'
import PollCreationContextProvider from './Context/PollCreationContext.tsx'
import SettingContextProvider from './Context/SettingContext.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContextApiProvider>
      <PollContextProvider>
        <PollCreationContextProvider>
          <SettingContextProvider>
            <App />
            <Toaster />
          </SettingContextProvider>
        </PollCreationContextProvider>
      </PollContextProvider>
    </ContextApiProvider>
  </StrictMode>,
)
