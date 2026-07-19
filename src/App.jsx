import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import Landing from './pages/Landing'
import CareerProfile from './pages/CareerProfile'
import AIAnalysis from './pages/AIAnalysis'
import WeeklyCheckIn from './pages/WeeklyCheckIn'
import GrowthReport from './pages/GrowthReport'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/profile" element={<CareerProfile />} />
          <Route path="/analysis" element={<AIAnalysis />} />
          <Route path="/check-in" element={<WeeklyCheckIn />} />
          <Route path="/report" element={<GrowthReport />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}
