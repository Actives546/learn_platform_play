import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import { useUserStore } from '@/store/userStore'

const ProtectedRoute = ({ children, isLogin }: { children: React.ReactNode; isLogin: boolean }) => {
  return isLogin ? <>{children}</> : <Navigate to="/login" replace />
}

const App = () => {
  const { initAuth, isLogin } = useUserStore()

  useEffect(() => {
    initAuth()
  }, [initAuth])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute isLogin={isLogin}>
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
