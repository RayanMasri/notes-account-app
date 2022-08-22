import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import useUtilityHook from '../../hooks/UtilityHook.jsx';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import Divider from '@mui/material/Divider';
import './Register.css';

import UserField from '../../components/UserField.jsx';

export default function Register() {
	const navigate = useNavigate();
	const [state, setState] = useState({
		email: '',
		password: '',
		username: '',
		// email: 'mrryanbro@gmail.com',
		// password: 'johnbartholomew',
		// username: 'John Bartholomew',
		passwordVisible: false,
		usernameError: '',
		emailError: '',
		passwordError: '',
	});

	const { formifyObject } = useUtilityHook();

	const email = useRef(null);
	const password = useRef(null);
	const username = useRef(null);
	const fields = {
		'email': email,
		'password': password,
		'username': username,
	};

	const rules = {
		'email': (text) => {
			if (text.trim().length != 0) {
				if (!text.toLowerCase().match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g)) {
					return [false, 'Your email is invalid'];
				}
			}
			return [true, ''];
		},
		'password': (text) => {
			if (text.trim().length != 0) {
				if (text.includes(' ')) {
					return [false, 'Passwords must not contain any spaces'];
				}

				if (text.length < 8) {
					return [false, 'Your password must be at least 8 characters.'];
				}
				if (text.length < 8) {
					return [false, 'Your password must not exceed 32 characters.'];
				}
			}
			return [true, ''];
		},
		'username': (text) => {
			if (text.trim().length != 0) {
				if (text.length < 4) {
					return [false, 'Your username must be at least 4 characters.'];
				}
				if (text.length < 8) {
					return [false, 'Your username must not exceed 32 characters.'];
				}
			}
			return [true, ''];
		},
	};

	useEffect(() => {
		fetch('http://localhost/account-server/auth-session.php', {
			method: 'POST',
			credentials: 'include',
		})
			.then(async (response) => {
				if (!response.ok) throw await response.text();
				return response.text();
			})
			.then((data) => {
				console.log(data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	const wrapPromise = async (promise) => {
		try {
			let data = await promise;
			return [data, null];
		} catch (error) {
			return [null, error];
		}
	};

	const validate = (text, type) => {
		return new Promise((resolve, reject) => {
			let [success, error] = rules[type](text);
			if (success) {
				resolve();
			} else {
				reject(error);
			}
		});
	};

	const onBlur = async (event) => {
		let [result, error] = await wrapPromise(validate(event.target.value, event.target.name));
		let key = event.target.name + 'Error';

		let object = {
			...state,
			[key]: '',
		};

		if (error) object[key] = error;

		setState(object);
	};

	const onKeyDown = (event) => {
		if (event.key != 'Enter') return;
		onSubmit();
	};

	const onSubmit = async () => {
		let object = {
			...state,
			emailError: '',
			passwordError: '',
			usernameError: '',
		};
		let post = true;

		for (let field of Object.keys(fields)) {
			let [_, error] = await wrapPromise(validate(state[field], field));

			if (state[field].trim().length == 0) error = 'Field is required';
			if (error) {
				object[field + 'Error'] = error;
				post = false;
			}
		}

		setState(object);

		if (!post) return;

		fetch('http://localhost/account-server/register.php', {
			method: 'POST',
			body: formifyObject({ email: state.email, password: state.password, username: state.username }),
		})
			.then(async (response) => {
				if (!response.ok) throw await response.text();
				return response.text();
			})
			.then((data) => {
				console.log(data);
			})
			.catch((error) => {
				let json = JSON.parse(error);
				let object = {
					...state,
					emailError: '',
					passwordError: '',
					usernameError: '',
				};

				json.map((error) => {
					object[error.type + 'Error'] = error.error;
				});

				setState(object);
			});
	};

	const onChange = (event) => {
		setState({
			...state,
			[event.target.name]: event.target.value,
		});
	};

	const togglePasswordVisibility = () => {
		setState({
			...state,
			passwordVisible: !state.passwordVisible,
		});
	};

	return (
		<div className='content-login'>
			<div
				className='global-header'
				onClick={() => {
					navigate('/');
				}}
			>
				<div>Home</div>
			</div>

			<div className='content'>
				<div className='field-box'>
					<div className='top'>
						<div>Create account</div>
					</div>
					<div className='bottom'>
						<UserField
							className='field'
							value={state.username}
							label='Username'
							name='username'
							type='text'
							inputRef={username}
							onChange={onChange}
							onKeyDown={onKeyDown}
							onBlur={onBlur}
							error={state.usernameError}
							sx={{
								marginBottom: state.usernameError ? '5px' : '10px',
							}}
						/>

						<UserField
							className='field'
							value={state.email}
							label='Email'
							name='email'
							type='email'
							inputRef={email}
							onChange={onChange}
							onKeyDown={onKeyDown}
							onBlur={onBlur}
							error={state.emailError}
							sx={{
								marginBottom: state.emailError ? '5px' : '10px',
							}}
						/>

						<UserField
							className='field'
							value={state.password}
							label='Password'
							name='password'
							type={state.passwordVisible ? 'text' : 'password'}
							inputRef={password}
							onChange={onChange}
							onKeyDown={onKeyDown}
							onBlur={onBlur}
							error={state.passwordError}
							sx={{
								marginBottom: state.passwordError ? '5px' : '10px',
							}}
							errorSx={{
								marginBottom: '0px',
							}}
							InputProps={{
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton edge='end' onClick={togglePasswordVisibility}>
											{state.passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>

						<Button
							className='submit-button'
							onClick={onSubmit}
							sx={{
								width: '100%',
								height: 40,
								fontSize: 15,
								mt: '10px',
							}}
						>
							Submit
						</Button>

						<Divider
							sx={{
								width: '270px',
								mt: '15px',
								backgroundColor: '#878787',
							}}
						/>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								mt: '10px',
							}}
							className='external-websites'
						>
							<IconButton
								sx={{
									width: 28,
									height: 28,
									mr: '10px',
								}}
								className='google'
							>
								<Icon>
									<img src='google.svg' />
								</Icon>
							</IconButton>
							<IconButton
								sx={{
									width: 28,
									height: 28,
									mr: '10px',
								}}
								className='twitter'
							>
								<Icon>
									<img src='twitter.svg' />
								</Icon>
							</IconButton>
							<IconButton
								sx={{
									width: 28,
									height: 28,
								}}
								className='facebook'
							>
								<Icon>
									<img src='facebook.svg' />
								</Icon>
							</IconButton>
						</Box>
						<div className='text-button switch' onClick={() => navigate('/login')}>
							Already have an account?&nbsp;<span>LOG IN</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
