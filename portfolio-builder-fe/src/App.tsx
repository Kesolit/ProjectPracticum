import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Editor from './pages/Editor/Editor'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Editor />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App