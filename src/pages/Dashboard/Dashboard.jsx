import React, { useEffect, useState, useRef } from 'react';
import useUtilityHook from '../../hooks/UtilityHook.jsx';
import useDidMountEffect from '../../hooks/useDidMountEffect.jsx';
import FixedColumnGrid from '../../components/FixedColumnGrid.jsx';
import Note from './components/Note.jsx';
import NoteAlter from './components/NoteAlter.jsx';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Box, SvgIcon } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { v4 as uuidv4 } from 'uuid';
import CircularProgress from '@mui/material/CircularProgress';

import './Dashboard.css';

export default function Dashboard() {
	const navigate = useNavigate();
	const { formifyObject, isVerticalOverflow } = useUtilityHook();
	const [state, _setState] = useState({
		remember: true,
		username: '',
		verified: false,
		saving: {
			status: false, // changes text value in browser
			logout: false, // runs a save when changed
			error: false,
			// id: null,
		},
		notes: {
			data: [],
			initial: false,
		},
		alter: {
			status: false,
			type: null,
			index: null, // index of note being edited
		},
	});
	const _state = useRef(state);
	const setState = (data) => {
		_state.current = data;
		_setState(data);
	};

	const updateNotesScrollbar = () => {
		Array.from(document.querySelectorAll('.dashboard-content > .content > .notes > div > div > div > .note')).map((element) => {
			if (isVerticalOverflow(element)) {
				element.style = 'border-top-right-radius: 0px; border-bottom-right-radius: 0px;';
			} else {
				element.style = 'border-top-right-radius: 20px; border-bottom-right-radius: 20px;';
			}
		});
	};

	const getNotes = () => {
		// do fetch here
		fetch('http://localhost/account-server/get-notes.php', {
			method: 'POST',
			credentials: 'include',
		})
			.then(async (response) => {
				if (!response.ok) throw await response.text();
				return response.text();
			})
			.then((data) => {
				let result = JSON.parse(data).result;

				setState({
					..._state.current,
					notes: {
						data: result.map((note) => {
							return {
								id: note.id,
								title: note.title,
								content: note.content,
							};
						}),
						initial: true,
					},
				});
			})
			.catch((error) => {
				let json = JSON.parse(error);

				setState({
					..._state.current,
					saving: {
						..._state.current.saving,
						status: true,
						error: json.error,
					},
				});
			});
	};

	useEffect(() => {
		updateNotesScrollbar();

		fetch('http://localhost/account-server/auth-session.php', {
			method: 'POST',
			body: formifyObject({
				keep_alive: true,
			}),
			credentials: 'include',
		}).then(async (response) => {
			let json = JSON.parse(await response.text());
			if (!json.success) return navigate('/');

			setState({
				...state,
				remember: json.remember,
				username: json.success,
				verified: json.verified,
			});

			getNotes();

			if (!json.remember) {
				setInterval(() => {
					fetch('http://localhost/account-server/auth-session.php', {
						method: 'POST',
						body: formifyObject({
							keep_alive: true,
						}),
						credentials: 'include',
					});
				}, 10000);
			}
		});
	}, []);

	useDidMountEffect(() => {
		if (state.notes.initial && !state.saving.logout) return console.log('Rejected note saving, initial fetch.');

		updateNotesScrollbar();

		// const id = uuidv4();
		console.log(`Saving notes`);
		setState({
			..._state.current,
			saving: {
				..._state.current.saving,
				status: true,
				error: false,
				// id: id,
			},
		});

		// do fetch here
		fetch('http://localhost/account-server/save-notes.php', {
			method: 'POST',
			body: formifyObject({ notes: JSON.stringify(_state.current.notes.data) }),
			credentials: 'include',
		})
			.then(async (response) => {
				if (!response.ok) throw await response.text();
				return response.text();
			})
			.then((data) => {
				if (state.saving.logout) {
					// do log out fetch here
					fetch('http://localhost/account-server/logout.php', {
						method: 'POST',
						credentials: 'include',
					}).then(() => navigate('/'));
				} else {
					setState({
						..._state.current,
						saving: {
							..._state.current.saving,
							status: false,
						},
					});
				}
			})
			.catch((error) => {
				let json = JSON.parse(error);

				setState({
					..._state.current,
					saving: {
						..._state.current.saving,
						error: json.error,
					},
				});
			});

		// setTimeout(() => {
		// 	if (_state.current.saving.id == id) {
		// 		setState({
		// 			..._state.current,
		// 			saving: {
		// 				..._state.current.saving,
		// 				status: false,
		// 				id: null,
		// 			},
		// 		});
		// 		console.log(`Successfully saved notes with id: "${id}"`);
		// 	} else {
		// 		console.log(`Cancelled saving notes with id: "${id}" due to interruption from another save`);
		// 	}
		// }, 2000);
	}, [state.notes, state.saving.logout]);

	// const save = (notes, object = undefined) => {
	// 	return new Promise((resolve, reject) => {
	// 		setState({
	// 			...state,
	// 			...(object || {}),
	// 			saving: true,
	// 		});
	// 		console.log(`Saving ${notes.length} note(s)...`);

	// 		setTimeout(function () {
	// 			setState({
	// 				...state,
	// 				saving: false,
	// 			});
	// 			console.log('Saved.');
	// 			resolve();
	// 		}, 1000);
	// 	});
	// };

	// const setNotes = (notes, object = undefined) => {
	// 	save(notes, object);

	// 	setState({
	// 		...state,
	// 		notes: notes,
	// 	});
	// };

	const logOut = () => {
		return new Promise(async (resolve, reject) => {
			setState({
				...state,
				saving: {
					...state.saving,
					logout: true,
				},
			});
			// await save();
			// await fetch('http://localhost/account-server/logout.php', {
			// 	method: 'POST',
			// 	credentials: 'include',
			// });
			// navigate('/');
		});
	};
	const onAlterSubmit = (event, title, content) => {
		switch (state.alter.type) {
			case 'creating':
				setState({
					...state,
					notes: {
						data: [
							...state.notes.data,
							{
								title: title,
								content: content,
								id: uuidv4(),
							},
						],
						initial: false,
					},
					alter: {
						status: false,
						type: null,
						index: null,
					},
				});
				break;
			case 'editing':
				setState({
					...state,
					notes: {
						data: state.notes.data.map((note, index) => {
							if (index != state.alter.index) return note;
							return {
								...note,
								title: title,
								content: content,
							};
						}),
						initial: false,
					},
					alter: {
						status: false,
						type: null,
						index: null,
					},
				});
				break;
		}
	};

	const onAlterClose = (event) => {
		setState({
			...state,
			alter: {
				status: false,
				type: null,
				index: null,
			},
		});
	};

	const createNote = () => {
		setState({
			...state,
			alter: {
				status: true,
				type: 'creating',
				index: null,
			},
		});
	};

	const onNoteClose = (noteIndex) => {
		setState({
			...state,
			notes: {
				data: state.notes.data.filter((_, index) => index != noteIndex),
				initial: false,
			},
		});
	};

	const onNoteEdit = (index) => {
		setState({
			...state,
			alter: {
				status: true,
				type: 'editing',
				index: index,
			},
		});
	};

	return (
		<div
			className='dashboard-content'
			style={{
				pointerEvents: state.saving.logout ? 'none' : 'all',
			}}
		>
			{state.saving.logout && (
				<div
					style={{
						backgroundColor: 'rgba(0, 0, 0, 0.7)',
						width: '100%',
						height: '100%',
						position: 'fixed',
						top: 0,
						left: 0,
						zIndex: 20,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<CircularProgress
						sx={{
							color: 'white',
							minWidth: '128px',
							minHeight: '128px',
						}}
					/>
				</div>
			)}

			{state.alter.status && <NoteAlter onSubmit={onAlterSubmit} onClose={onAlterClose} editing={state.alter.type == 'editing' ? state.notes.data[state.alter.index] : false} />}

			<div className='global-header'>
				<div className='save-indicator' style={{ color: state.saving.error ? 'red' : 'white' }}>
					{state.saving.status ? (state.saving.error ? state.saving.error : 'Saving...') : ''}
				</div>
				{/* <div className='save-indicator'> Saving...</div> */}
				<button className='log-out-button' onClick={logOut}>
					Log out
				</button>
				{!state.verified && (
					<div
						className='verification'
						style={{
							marginRight: '25px',
							color: 'darkred',
							backgroundColor: 'coral',
							borderRadius: '10px',
							paddingLeft: '10px',
							paddingRight: '10px',
						}}
					>
						Email not verified&nbsp;
						<span
							style={{
								textDecoration: 'underline',
							}}
							onClick={() => navigate('/verify')}
						>
							Verify
						</span>
					</div>
				)}
			</div>

			<div className='content'>
				<div className='title'>
					<div>Content</div>
					<IconButton onClick={createNote}>
						<ControlPointIcon
							sx={{
								color: 'black',
							}}
						/>
					</IconButton>
				</div>

				<div
					className='notes'
					style={{
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					<FixedColumnGrid
						name='notes-grid'
						columns={9}
						style={{
							width: 'max-content',
							height: 'max-content',
						}}
						rowStyle={{
							marginBottom: '15px',
						}}
						rowSpacing={'11px'}
					>
						{state.notes.data.map((note, index) => {
							return <Note title={note.title} content={note.content} onEdit={onNoteEdit} onClose={onNoteClose} index={index} key={`key-${note.id}`} />;
						})}
					</FixedColumnGrid>
				</div>
				{/* <div
					className='notes'
					style={{
						gridTemplateRows: `repeat(${Math.ceil(state.notes.length / 2)}, 1fr)`,
					}}
				>
					{state.notes.map((note) => {
						return (
							<div
								style={{
									width: '125px',
									height: '125px',
									backgroundColor: 'red',
								}}
							></div>
						);
					})}
				</div> */}
			</div>
		</div>
	);
}
