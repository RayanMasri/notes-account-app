import React, { useEffect, useState, useRef } from 'react';
import { InputAdornment, IconButton, FormGroup, FormControlLabel, Checkbox, Icon, Box, Divider } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useUtilityHook from '../../hooks/UtilityHook.jsx';
import LoadingButton from '../../components/LoadingButton.jsx';
import UserField from '../../components/UserField.jsx';
import './Login.css';

export default function Login() {
	const navigate = useNavigate();
	const [state, setState] = useState({
		email: {
			// value: 'mrryanbro@gmail.com',
			value: '',
			error: '',
		},
		password: {
			// value: 'johnbartholomew',
			value: '',
			error: '',
			visible: false,
		},
		remember: (localStorage.getItem('remember') || false) == 'true',
		loading: false,
	});

	const { formifyObject, wrapPromise } = useUtilityHook();

	const email = useRef(null);
	const password = useRef(null);
	const fields = {
		'email': email,
		'password': password,
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
			if (text.trim().length == 0) {
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
	};

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

		let object = {
			...state,
			[event.target.name]: {
				...state[event.target.name],
				error: '',
			},
		};

		if (error) object[event.target.name].error = error;

		setState(object);
	};

	const onKeyDown = (event) => {
		if (event.key != 'Enter') return;
		onSubmit();
		// if (event.key != 'Enter') return;
		// let index = Object.keys(fields).findIndex((e) => e == event.target.name) + 1;
		// if (index + 1 > Object.keys(fields).length) {
		// 	event.preventDefault();
		// 	return onSubmit();
		// }

		// let field = fields[Object.keys(fields)[index]];
		// field.current.focus();
	};

	const onSubmit = async () => {
		if (state.loading) return;

		let object = {
			...state,

			// emailError: '',
			// passwordError: '',
		};
		let post = true;

		for (let field of Object.keys(fields)) {
			let [_, error] = await wrapPromise(validate(state[field].value, field));

			if (state[field].value.trim().length == 0) error = 'Field is required';
			if (error) {
				object[field].error = error;
				post = false;
			}
		}

		if (!post) {
			setState(object);
			return;
		} else {
			setState({
				...object,
				loading: true,
			});
		}

		fetch('http://localhost/account-server/login.php', {
			method: 'POST',
			body: formifyObject({ email: state.email.value, password: state.password.value, remember: state.remember }),
			credentials: 'include',
		})
			.then(async (response) => {
				if (!response.ok) throw await response.text();
				return response.text();
			})
			.then((data) => {
				let result = JSON.parse(data);
				if (result.success) {
					navigate('/dashboard');
				}

				setState({
					...object,
					loading: false,
				});
			})
			.catch((error) => {
				let json = JSON.parse(error);
				let object = {
					...state,
					email: { ...state.email, error: '' },
					password: { ...state.password, error: '' },
				};

				json.map((error) => {
					object[error.type].error = error.error;
				});

				setState({
					...object,
					loading: false,
				});
			});
	};

	const onChange = (event) => {
		setState({
			...state,
			[event.target.name]: {
				value: event.target.value,
				error: '',
			},
		});
	};

	const togglePasswordVisibility = () => {
		setState({
			...state,
			password: {
				...state.password,
				visible: !state.password.visible,
			},
		});
	};

	const forgotPassword = () => {
		navigate('/');
	};

	const onRememberChange = (event) => {
		setState({
			...state,
			remember: event.target.checked,
		});

		localStorage.setItem('remember', event.target.checked);
	};

	return (
		<div className='content-login'>
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
				<div className='field-box'>
					<div className='top'>
						<div>Login</div>
					</div>
					<div className='bottom'>
						<UserField
							className='field'
							value={state.email.value}
							label='Email'
							name='email'
							type='email'
							inputRef={email}
							onChange={onChange}
							onKeyDown={onKeyDown}
							onBlur={onBlur}
							error={state.email.error}
							sx={{
								marginBottom: state.email.error ? '5px' : '10px',
							}}
						/>

						<UserField
							className='field'
							value={state.password.value}
							label='Password'
							name='password'
							type={state.password.visible ? 'text' : 'password'}
							inputRef={password}
							onChange={onChange}
							onKeyDown={onKeyDown}
							onBlur={onBlur}
							error={state.password.error}
							sx={{
								marginBottom: state.password.error ? '5px' : '0px',
							}}
							errorSx={{
								marginBottom: '0px',
							}}
							InputProps={{
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton edge='end' onClick={togglePasswordVisibility}>
											{state.password.visible ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>

						<FormGroup sx={{ width: '100%' }}>
							<FormControlLabel
								control={
									<Checkbox
										size='small'
										sx={{
											color: '#878787',
										}}
										checked={state.remember}
										onChange={onRememberChange}
									/>
								}
								label='Remember me'
								sx={{
									color: '#878787',
									userSelect: 'none',
								}}
							/>
						</FormGroup>

						<LoadingButton
							className='submit-button'
							onClick={onSubmit}
							sx={{
								width: '100%',
								height: 40,
								fontSize: 15,
								mt: '10px',
							}}
							loading={state.loading}
							progressProps={{
								sx: {
									color: 'white',
									maxWidth: '24px',
									maxHeight: '24px',
								},
							}}
						>
							Submit
						</LoadingButton>

						<div className='text-button forgot' onClick={forgotPassword}>
							Forgot password?
						</div>
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
						<div className='text-button switch' onClick={() => navigate('/register')}>
							Need an account?&nbsp;<span>CREATE ACCOUNT</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
