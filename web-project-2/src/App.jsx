import { useState } from 'react'
import './App.css'
import { AppContext } from './context/authContext'
import { Routes } from 'react-router-dom'
import Header from './components/Base/Header/Header'
import Footer from './components/Base/Footer/Footer'

function App() {
  const [state, setAppState] = useState({
    user: null,
    userData: null,
  })

  return (
    <AppContext.Provider value={{ ...state, setContext: setAppState}}>
      <Header />
      <Routes>

      </Routes>
      <Footer />
    </AppContext.Provider>
  )
}

export default App
