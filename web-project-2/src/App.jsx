import { useState } from 'react'
import './App.css'
import { AppContext } from './context/authContext'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Base/Header/Header'
import Footer from './components/Base/Footer/Footer'
import Homepage from './pages/Homepage/Homepage'
import PageNotFound from './pages/PageNotFound/PageNotFound'
import { Login } from './pages/Login/Login'
import Register from './pages/Register/Register'

function App() {
  const [state, setAppState] = useState({
    user: null,
    userData: null,
  })

  return (
    <AppContext.Provider value={{ ...state, setAppState: setAppState}}>
      <Header />
      <Routes>
        <Route index element={<Homepage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
      <Footer />
    </AppContext.Provider>
  )
}

export default App

//Test
