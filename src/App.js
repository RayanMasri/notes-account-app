import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Verify from './pages/Verify/Verify.jsx';
import './App.css';

// transition height of errors
// prevent user from viewing dashboard while not beign logged in (it is possilbe for less than a second)
// no real limit on the notes, try limiting
// optimize note saving speed by compressing into one query

function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
				<Route path='/dashboard' element={<Dashboard />} />
				<Route path='/verify' element={<Verify />} />
			</Routes>
		</Router>
	);
}

export default App;
