import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
	const navigate = useNavigate();

	useEffect(() => {
		fetch('http://localhost/account-server/auth-session.php', {
			method: 'POST',
			credentials: 'include',
		}).then(async (response) => {
			let json = JSON.parse(await response.text());
			if (json.success) {
				navigate('/dashboard');
			}
		});
	}, []);

	return (
		<div className='home-content'>
			<div className='global-header'>
				<div
					className='home-button'
					onClick={() => {
						navigate('/');
					}}
				>
					Home
				</div>
			</div>
			<div className='content'>
				<div className='title'>Account Login/Register Test Application</div>
				<div className='buttons'>
					<div
						onClick={() => {
							navigate('login');
						}}
					>
						Login
					</div>
					<div
						onClick={() => {
							navigate('register');
						}}
					>
						Register
					</div>
				</div>
			</div>
		</div>
	);
}
