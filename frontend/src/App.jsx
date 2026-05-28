//import { useState } from 'react'
import {  Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
//import Login from './pages/Login';
//import Dashboard from './pages/Dashboard';

function App() {
  return (

      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>

  );
}export default App;