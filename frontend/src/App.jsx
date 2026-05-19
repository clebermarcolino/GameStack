import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NotifProvider } from './context/NotifContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Players from './pages/Players'
import Games from './pages/Games'
import Rankings from './pages/Rankings'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <NotifProvider>
        <Layout>
          <Routes>
            <Route path="/"         element={<Dashboard />} />
            <Route path="/players"  element={<Players />}   />
            <Route path="/games"    element={<Games />}     />
            <Route path="/rankings" element={<Rankings />}  />
          </Routes>
        </Layout>
      </NotifProvider>
    </BrowserRouter>
  )
}
