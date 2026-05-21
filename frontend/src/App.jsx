import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NotifProvider } from './context/NotifContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Players from './pages/Players'
import Games from './pages/Games'
import Rankings from './pages/Rankings'
import Login from './pages/Login'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <NotifProvider>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/players"   element={<Layout><Players /></Layout>}   />
          <Route path="/games"     element={<Layout><Games /></Layout>}     />
          <Route path="/rankings"  element={<Layout><Rankings /></Layout>}  />
        </Routes>
      </NotifProvider>
    </BrowserRouter>
  )
}