import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Verify from './pages/Verify/Verify.jsx';
import './App.css';

// transition height of errors when showing
// prevent user from viewing dashboard for less than a second while not being logged in
// no real limit on the notes, try limiting
// optimize note saving speed by compressing into one query
// make config into .ini file and then get file contents in config.php, or make into a custom file format where variables are defined by english sentences, like: "resend timeout: 5 minutes, max attempts: 10"
// modularize Verify.jsx process of handling verification code

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
