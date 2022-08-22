import React, { useEffect, useRef } from 'react';
import { IconButton, Divider } from '@mui/material';
import { Close, Edit } from '@mui/icons-material';

export default function Note(props) {
	return (
		<div className='note' ref={props.ref}>
			<div className='header'>
				<div
					className='title'
					style={{
						color: props.title.trim() == '' ? 'rgba(43, 43, 43, 0.509)' : 'black',
						userSelect: props.title.trim() == '' ? 'none' : 'all',
					}}
				>
					{props.title.trim() == '' ? 'Blank' : props.title}
				</div>
				<div className='right-panel'>
					<IconButton
						sx={{
							width: '24px',
							height: '24px',
							mr: '2px',
						}}
						onClick={() => props.onEdit(props.index)}
					>
						<Edit sx={{ color: '#474747', width: '20px', height: '20px' }} />
					</IconButton>
					<IconButton
						sx={{
							width: '24px',
							height: '24px',
						}}
						onClick={() => props.onClose(props.index)}
					>
						<Close sx={{ color: '#474747', width: '20px', height: '20px' }} />
					</IconButton>
				</div>
			</div>
			<Divider
				sx={{
					width: '100%',
					mt: '5px',
					backgroundColor: '#474747',
				}}
			/>
			<div className='content'>
				<div>{props.content}</div>
			</div>
		</div>
	);
}
