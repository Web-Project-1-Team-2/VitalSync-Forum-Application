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
import Training from './pages/Training/Training'
import Nutrition from './pages/Nutrition/Nutrition'
import Supplements from './pages/Supplements/Supplements'
import Container from './components/Base/Container/Container'
import CreatePost from './pages/CreatePost/CreatePost'
function App() {
  const [state, setAppState] = useState({
    user: null,
    userData: null,
  })

  return (
    <AppContext.Provider value={{ ...state, setAppState: setAppState }}>
      <Header />
      <Container>
        <Routes>
          <Route index element={<Homepage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/training' element={<Training />} />
          <Route path='/nutrition' element={<Nutrition />} />
          <Route path='/supplements' element={<Supplements />} />
          <Route path='/create' element={<CreatePost />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Container>
      <Footer />
    </AppContext.Provider>
  )
}

export default App

//Test
