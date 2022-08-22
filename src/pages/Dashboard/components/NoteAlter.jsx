import React, { useState } from 'react';
import Button from '@mui/material/Button';

export default function NoteAlter(props) {
	const [state, setState] = useState({
		title: props.editing ? props.editing.title : '',
		content: props.editing ? props.editing.content : '',
	});

	const onTitleChange = (event) => {
		setState({
			...state,
			title: event.target.value,
		});
	};

	const onContentChange = (event) => {
		setState({
			...state,
			content: event.target.value,
		});
	};

	return (
		<div
			className='note-alter'
			style={{
				backgroundColor: 'rgb(0, 0, 0, 0.7)',
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				zIndex: '10',
			}}
		>
			<div
				style={{
					backgroundColor: '#515151',
					width: '800px',
					height: 'max-content',
					borderRadius: '20px',
					paddingRight: '20px',
					paddingLeft: '20px',
					paddingTop: '20px',
					boxSizing: 'border-box',
				}}
			>
				<input
					type='text'
					value={state.title}
					style={{
						width: '100%',
						fontSize: '20px',
						fontFamily: 'JannaLT',
						boxSizing: 'border-box',
						backgroundColor: 'transparent',
						border: 'none',
						outline: 'none',
						borderBottom: '1px solid black',
					}}
					placeholder='Title'
					onChange={onTitleChange}
				/>
				<textarea
					value={state.content}
					style={{
						width: '100%',
						height: '450px',
						boxSizing: 'border-box',
						marginTop: '10px',
						backgroundColor: 'transparent',
						borderRadius: '5px',
						padding: '5px',
						fontSize: '14px',
						fontFamily: 'JannaLT',
						resize: 'none',
						border: 'none',
						border: '1px solid black',
						outline: 'none',
					}}
					placeholder='Content'
					onChange={onContentChange}
				></textarea>
				<Button
					sx={{
						color: 'black',
						width: '100%',
						mb: '5px',
						mt: '5px',
						fontFamily: 'JannaLT',
					}}
					onClick={(event) => props.onSubmit(event, state.title, state.content)}
				>
					Submit
				</Button>
				<Button
					sx={{
						color: 'black',
						width: '100%',
						mb: '15px',
						fontFamily: 'JannaLT',
					}}
					onClick={props.onClose}
				>
					Close
				</Button>
			</div>
		</div>
	);
}
