import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Editor from './pages/Editor/Editor'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import PublicView from './pages/PublicView/PublicView'
import Dashboard from './pages/Dashboard/Dashboard'
import Preview from './pages/Preview/Preview'
import SettingsPage from './pages/Settings/SettingsPage';
import OAuthCallback from './pages/oauth-callback/OAuthCallback'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Editor />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/preview" element={<Preview />} />

        <Route path="/editor/:id" element={<Editor />} />
        
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/view/:slug" element={<PublicView />} />

        <Route path="/settings" element={<SettingsPage />} />

        <Route path="/oauth-callback" element={<OAuthCallback />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App