import { useRoutes } from 'react-router-dom'
import { useBridgeReady } from '@/bridge/hooks'
import { routes } from './router'
import { MainLayout } from '@/components/layout/MainLayout'
import { LoadingScreen } from '@/components/common/LoadingScreen'

function App() {
  const ready = useBridgeReady()
  const element = useRoutes(routes)

  // 等待 Bridge 就绪
  if (!ready) {
    return <LoadingScreen />
  }

  return <MainLayout>{element}</MainLayout>
}

export default App
