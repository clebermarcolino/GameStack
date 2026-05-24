import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { NotifProvider } from './context/NotifContext'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
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
      <AuthProvider>
        <NotifProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
            <Route path="/players"  element={<PrivateRoute><Layout><Players /></Layout></PrivateRoute>} />
            <Route path="/games"    element={<PrivateRoute><Layout><Games /></Layout></PrivateRoute>} />
            <Route path="/rankings" element={<PrivateRoute><Layout><Rankings /></Layout></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotifProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}