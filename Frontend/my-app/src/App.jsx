import React from 'react'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import DashBoard from './pages/DashBoard'
import NotFound from './pages/NotFound'


const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/Login' element={<Login/>}/>
      <Route path='/Register' element={<Register/>}/>
      <Route path='/DashBoard' element={<DashBoard/>}/>
      <Route path='/*' element={<NotFound/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App