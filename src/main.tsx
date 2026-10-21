import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/app/App'

import './index.css'

async function enableMocking() {
  if (import.meta.env.MODE !== 'test') {
    const { worker } = await import('@/shared/mocks/browser')
    await worker.start({
      onUnhandledFrame: 'bypass',
      quiet: true,
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      },
    })
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
