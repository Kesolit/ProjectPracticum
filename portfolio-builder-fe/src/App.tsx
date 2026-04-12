import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Editor from './pages/Editor/Editor'
import Register from './pages/Register/Register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Editor />} />
        <Route path="/register" element={<Register />} />
        {/* TODO: добавить /login */}
      </Routes>
    </BrowserRouter>
  )
}

export default App