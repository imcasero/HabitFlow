import { BrowserRouter, Route, Routes } from 'react-router'
import { AuthCallback } from '@/pages/AuthCallback'
import { Dashboard } from '@/pages/Dashboard'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
