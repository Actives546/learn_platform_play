import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import Profile from '@/pages/Profile'
import CoursePage from '@/pages/Teaching/Course'
import ChapterPage from '@/pages/Teaching/Chapter'
import QuestionPage from '@/pages/Teaching/Question'
import TeachingPlanPage from '@/pages/Teaching/Plan'
import StudentPage from '@/pages/Personnel/Student'
import TeacherPage from '@/pages/Personnel/Teacher'
import StudyProgressPage from '@/pages/Progress/Study'
import CertificatePage from '@/pages/Progress/Certificate'
import StudyPlanPage from '@/pages/Progress/StudyPlan'
import StatisticsPage from '@/pages/Analysis/Statistics'
import RankingPage from '@/pages/Analysis/Ranking'
import ScoreAnalysisPage from '@/pages/Analysis/Score'
import MenuManagementPage from '@/pages/Menu/Management'
import RoleManagementPage from '@/pages/Menu/Role'
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
        <Route path="profile" element={<Profile />} />
        <Route path="setting" element={<div>系统设置</div>} />
        
        <Route path="teaching">
          <Route path="course" element={<CoursePage />} />
          <Route path="chapter" element={<ChapterPage />} />
          <Route path="question" element={<QuestionPage />} />
          <Route path="plan" element={<TeachingPlanPage />} />
        </Route>
        
        <Route path="personnel">
          <Route path="student" element={<StudentPage />} />
          <Route path="teacher" element={<TeacherPage />} />
        </Route>
        
        <Route path="progress">
          <Route path="study" element={<StudyProgressPage />} />
          <Route path="certificate" element={<CertificatePage />} />
          <Route path="study-plan" element={<StudyPlanPage />} />
        </Route>
        
        <Route path="analysis">
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="ranking" element={<RankingPage />} />
          <Route path="score" element={<ScoreAnalysisPage />} />
        </Route>
        
        <Route path="menu">
          <Route path="management" element={<MenuManagementPage />} />
          <Route path="role" element={<RoleManagementPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
