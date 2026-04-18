import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Editor from './pages/Editor/Editor'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import PublicView from './pages/PublicView/PublicView' 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Твои текущие роуты */}
        <Route path="/" element={<Editor />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* 2. Добавляем динамический роут для просмотра */}
        <Route path="/view/:id" element={<PublicView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App