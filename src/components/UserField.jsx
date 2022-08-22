import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
	notchedOutline: {
		borderColor: '#878787 !important',
	},
	cssLabel: {
		color: '#878787 !important',
	},
});

export default function UserField(props) {
	const classes = useStyles();

	// const low = {
	// 	backgroundColor: 'transparent',
	// 	color: '#878787',
	// 	width: '100%',
	// };

	// const high = {
	// 	backgroundColor: '#A30000',
	// 	color: 'white',
	// 	width: '100%',
	// 	marginBottom: '10px',
	// 	borderRadius: '5px',
	// 	px: '10px',
	// 	py: '5px',
	// 	boxSizing: 'border-box',
	// };

	return (
		<div
			style={{
				width: '100%',
				height: 'max-content',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<TextField
				autoFocus={props.autoFocus}
				className='field'
				value={props.value}
				inputRef={props.inputRef}
				onChange={props.onChange}
				onBlur={props.onBlur}
				label={props.label}
				name={props.name}
				InputProps={{
					...props.InputProps,
					type: props.type,
					classes: {
						notchedOutline: classes.notchedOutline,
					},
				}}
				InputLabelProps={{
					shrink: true,
					classes: {
						root: classes.cssLabel,
					},
				}}
				sx={{
					...props.sx,
					width: '100%',
				}}
				onKeyDown={props.onKeyDown}
			/>
			{props.error && (
				<Box
					sx={{
						backgroundColor: '#A30000',
						color: 'white',
						width: '100%',
						marginBottom: '10px',
						borderRadius: '5px',
						px: '10px',
						py: '5px',
						boxSizing: 'border-box',
						...props.errorSx,
					}}
				>
					<Typography
						style={{
							fontSize: '13px',
						}}
					>
						{props.error}
					</Typography>
				</Box>
			)}
		</div>
	);
}
