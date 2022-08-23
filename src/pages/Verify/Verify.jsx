import React, { useEffect, useState, useRef } from 'react';
import { InputAdornment, IconButton, Icon, Box, Divider } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useUtilityHook from '../../hooks/UtilityHook.jsx';
import LoadingButton from '../../components/LoadingButton.jsx';
import UserField from '../../components/UserField.jsx';
import './Verify.css';

export default function Register() {
	const navigate = useNavigate();
	const [state, setState] = useState({
		digit1: '',
		digit2: '',
		digit3: '',
		digit4: '',
		loading: false,
		error: false,
	});

	const { formifyObject, wrapPromise } = useUtilityHook();

	useEffect(() => {
		fetch('http://localhost/account-server/auth-session.php', {
			method: 'POST',
			credentials: 'include',
		}).then(async (response) => {
			let json = JSON.parse(await response.text());
			if (!json.success) return navigate('/');
			if (json.verified) return navigate('/dashboard');
		});
	}, []);

	const onBlur = (event) => {};

	const onSubmit = async () => {
		if (state.loading) return;

		console.log('Verifying');
		// fetch('http://localhost/account-server/register.php', {
		// 	method: 'POST',
		// 	body: formifyObject({ email: state.email.value, password: state.password.value, username: state.username.value, remember: state.remember }),
		// 	credentials: 'include',
		// })
		// 	.then(async (response) => {
		// 		if (!response.ok) throw await response.text();
		// 		return response.text();
		// 	})
		// 	.then((data) => {
		// 		let result = JSON.parse(data);
		// 		if (result.success) {
		// 			navigate('/dashboard');
		// 		}

		// 		setState({
		// 			...object,
		// 			loading: false,
		// 		});
		// 	})
		// 	.catch((error) => {
		// 		let json = JSON.parse(error);
		// 		let object = {
		// 			...state,
		// 			email: { ...state.email, error: '' },
		// 			password: { ...state.password, error: '' },
		// 			username: { ...state.username, error: '' },
		// 		};

		// 		json.map((error) => {
		// 			object[error.type].error = error.error;
		// 		});

		// 		setState({
		// 			...object,
		// 			loading: false,
		// 		});
		// 	});
	};

	const onChange = (event) => {
		// backspace
		console.log(event.target.value);
		if (event.target.value == '') {
			let previous = `digit${parseInt(event.target.name.split('digit')[1]) - 1}`;
			console.log('backspaced to previous ');
			console.log(previous);
			if (previous in state) {
				document.querySelector(`.code-digits > .code-digit[name|="${previous}"]`).focus();
			}
		} else {
			//  wrote digit
			let next = `digit${parseInt(event.target.name.split('digit')[1]) + 1}`;
			console.log('goint to next ');
			console.log(next);
			if (event.target.value.length == 1) {
				if (next in state) {
					document.querySelector(`.code-digits > .code-digit[name|="${next}"]`).focus();
				}
			} else {
				if (next in state) {
					setState({
						...state,
						[next]: event.target.value[1],
					});
					document.querySelector(`.code-digits > .code-digit[name|="${next}"]`).focus();
				}
				return;
			}
		}

		console.log(`${event.target.name}: ${event.target.value}`);
		setState({
			...state,
			[event.target.name]: event.target.value,
		});
	};

	const onKeyDown = (event) => {
		if (event.key == 'ArrowLeft') {
			let previous = `digit${parseInt(event.target.name.split('digit')[1]) - 1}`;
			if (previous in state) {
				document.querySelector(`.code-digits > .code-digit[name|="${previous}"]`).focus();
			}
			return;
		}

		if (event.key == 'ArrowRight') {
			let next = `digit${parseInt(event.target.name.split('digit')[1]) + 1}`;
			if (next in state) {
				document.querySelector(`.code-digits > .code-digit[name|="${next}"]`).focus();
			}
			return;
		}

		// if (event.key == 'a' && event.ctrlKey) {
		// 	let node = document.querySelector('.code-digits');
		// 	console.log('select all');
		// 	if (document.body.createTextRange) {
		// 		const range = document.body.createTextRange();
		// 		range.moveToElementText(node);
		// 		range.select();
		// 	} else if (window.getSelection) {
		// 		const selection = window.getSelection();
		// 		const range = document.createRange();
		// 		range.selectNodeContents(node);
		// 		selection.removeAllRanges();
		// 		selection.addRange(range);
		// 	} else {
		// 		console.warn('Could not select text in node: Unsupported browser.');
		// 	}
		// }
	};

	const sendEmail = () => {
		fetch('http://localhost/account-server/send-verify-email.php', {
			method: 'POST',
			credentials: 'include',
		})
			.then(async (response) => {
				if (!response.ok) throw await response.text();
				return response.text();
			})
			.then((data) => {
				let result = JSON.parse(data);

				setState({
					...state,
					error: false,
				});
			})
			.catch((error) => {
				let json = JSON.parse(error);
				setState({
					...state,
					error: json.error,
				});
			});
	};

	return (
		<div className='content-verify'>
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
						<div>Verification</div>
					</div>
					<Divider
						sx={{
							width: '250px',
							backgroundColor: '#878787',
						}}
					/>
					<div className='bottom'>
						<div className='code-digits'>
							<input type='number' className='code-digit' name='digit1' value={state.digit1} onKeyDown={onKeyDown} onChange={onChange} />
							<input type='number' className='code-digit' name='digit2' value={state.digit2} onKeyDown={onKeyDown} onChange={onChange} />
							<input type='number' className='code-digit' name='digit3' value={state.digit3} onKeyDown={onKeyDown} onChange={onChange} />
							<input type='number' className='code-digit' name='digit4' value={state.digit4} onKeyDown={onKeyDown} onChange={onChange} />
						</div>
						<LoadingButton
							className='submit-button'
							disabled={!state.digit1 || !state.digit2 || !state.digit3 || !state.digit4}
							onClick={onSubmit}
							sx={{
								width: '100%',
								height: 40,
								fontSize: 15,
								mt: '10px',
								opacity: !state.digit1 || !state.digit2 || !state.digit3 || !state.digit4 ? 0.5 : 1,
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
						<div
							style={{
								width: '100%',
								textAlign: 'right',
								marginTop: '5px',
								lineHeight: '1.1',
								textDecoration: 'underline',
							}}
							className='send-email'
							onClick={sendEmail}
						>
							Resend verification email
						</div>
						{state.error && (
							<div
								style={{
									width: '100%',
									textAlign: 'right',
									lineHeight: '1.1',
									color: 'rgb(158, 46, 46)',
								}}
							>
								{state.error}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
