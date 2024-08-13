/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
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
import { auth, db } from './config/firebase-config'
import { useAuthState } from 'react-firebase-hooks/auth'
import LoadingHeader from './components/Base/Header/LoadingHeader'
import { getUserData } from './services/user.service'
import Posts from './pages/Posts/Posts'
import DetailedPost from './pages/DetailedPost/DetailedPost'
import Authenticated from './components/hoc/Authenticated'
import { useObjectVal } from 'react-firebase-hooks/database'
import { ref } from 'firebase/database'
import Admin from './pages/Admin/Admin';
import Profile from './pages/Profile/Profile'
import UserProfile from './pages/UserProfile/UserProfile'


function App() {

  const [state, setAppState] = useState({
    user: null,
    userData: null,
  })

  const [user, loading] = useAuthState(auth);
  const [currentUser] = useObjectVal(ref(db, `users/${state.userData?.username}`));

  if (state.user !== user) {
    setAppState({ ...state, user: user })
  }

  useEffect(() => {
    if (!user) return;

    getUserData(state.user.uid)
      .then(data => {
        const userData = data[Object.keys(data)[0]];
        setAppState({ ...state, userData: userData });
      })
  }, [user])

  useEffect(() => {
    if (!currentUser) return;
    setAppState({ ...state, userData: currentUser });
  }, [currentUser, state.userData])


  return (
    <AppContext.Provider value={{ ...state, setAppState: setAppState }}>
      {loading ? <LoadingHeader /> : <Header />}
      <Container>
        <Routes>
          <Route index element={<Homepage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/training' element={<Training />} />
          <Route path='/posts' element={<Authenticated><Posts /></Authenticated>} />
          <Route path='/posts/:id' element={<Authenticated><DetailedPost /></Authenticated>} />
          <Route path='/nutrition' element={<Nutrition />} />
          <Route path='/supplements' element={<Supplements />} />
          <Route path='/create' element={<Authenticated><CreatePost /></Authenticated>} />
          <Route path='*' element={<PageNotFound />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/profile' element={<Authenticated><Profile /></Authenticated>} />
          <Route path='/profile/:username' element={<UserProfile />} />
        </Routes>
      </Container>
      <Footer />
    </AppContext.Provider>
  )
}


export default App

