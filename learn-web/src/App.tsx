import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import { useUserStore } from '@/store/userStore'

const App = () => {
  const { initAuth, isLogin } = useUserStore()

  useEffect(() => {
    initAuth()
  }, [initAuth])

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isLogin ? <>{children}</> : <Navigate to="/login" replace />
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="course" element={<div>课程管理</div>} />
        <Route path="user" element={<div>用户管理</div>} />
        <Route path="setting" element={<div>系统设置</div>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
