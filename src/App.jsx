import { useState } from 'react'
import Layout from './components/Layout'
import Sidebar from './components/Sidebar'
import ViewSelector from './components/ViewSelector'
import DailyView from './components/DailyView'
import WeeklyView from './components/WeeklyView'
import MonthlyView from './components/MonthlyView'
import YearlyView from './components/YearlyView'
import CategoryManager from './components/CategoryManager'
import Login from './components/Login'
import { usePlanner } from './hooks/usePlanner'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  const [currentView, setCurrentView] = useState('daily');
  // We'll hook up usePlanner later as we rebuild the data layer
  // const planner = usePlanner();

  const renderView = () => {
    switch (currentView) {
      case 'daily': return <DailyView />;
      case 'weekly': return <WeeklyView />;
      case 'monthly': return <MonthlyView />;
      case 'yearly': return <YearlyView />;
      case 'categories': return <CategoryManager />;
      case 'login': return <Login onLoginSuccess={() => setCurrentView('daily')} />;
      default: return <DailyView />;
    }
  };

  return (
    <AuthProvider>
      <Layout
        sidebar={<Sidebar />}
        topBar={<ViewSelector currentView={currentView} onViewChange={setCurrentView} />}
      >
        {renderView()}
      </Layout>
    </AuthProvider>
  )
}

export default App
