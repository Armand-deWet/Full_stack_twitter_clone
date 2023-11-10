import './App.css';
import axios from 'axios'
import { useEffect, useState } from 'react';
import {BrowserRouter as Router, Route, Routes, Link, useNavigate} from 'react-router-dom'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Login from './pages/Login';
import Registration from './pages/Registration';
import { AuthContext } from './helpers/AuthContext'
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/Profile';
import changePassword from './pages/changePassword';


function App() {
const [authState, setAuthState] = useState({username: '', id: 0, status: false})
const navigate = useNavigate()

useEffect( () => {
  axios.get('http://localhost:3001/auth/auth', { headers: {
    accessToken: localStorage.getItem('accessToken')
  } }).then((response) => {
    if (response.data.error) {
      setAuthState({...authState, status: false})
    } else {
      setAuthState({username: response.data.username, id: response.data.id, status: true})
    }
  })
}, [])

const logOut = () => {
  localStorage.removeItem('accessToken')
  setAuthState({username: '', id: 0, status: false})
  navigate('/login')
}
return (
<div className='App'>
  <AuthContext.Provider value={{authState, setAuthState}}>
      <div className='navbar'>
        <div className='links'>
          {!authState.status ? (
              <>
              <Link to='/login'>Login</Link>
              <Link to='/registration'>Register</Link>
              </>
            ) : (
              <>
                <Link to='/'>Home Page</Link>
                <Link to='/createpost'>Create a Post</Link>
              </>
            )}
          </div>
          <div className='loggedInContainer'>
            <h1>{authState.username}</h1>
            {authState.status && <button onClick={logOut}>Logout</button>}
          </div>
      </div>
      <Routes>
        <Route path='/' exact Component={Home} />
        <Route path='/createpost' exact Component={CreatePost} />
        <Route path='/post/:id' exact Component={Post} />
        <Route path='/registration' exact Component={Registration} />
        <Route path='/login' exact Component={Login} />
        <Route path='/profile/:id' exact Component={Profile} />
        <Route path='/changepassword' exact Component={changePassword} />
        <Route path='*' exact Component={PageNotFound} />
      </Routes>
  </AuthContext.Provider>
</div>
)
}

export default App;
