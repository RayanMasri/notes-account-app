import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import Button from '@mui/material//Button';
import CircularProgress from '@mui/material/CircularProgress';
import Check from '@mui/icons-material/Check';

const LoadingButton = (props) => {
	const { classes, loading, done, progressProps, ...other } = props;

	if (done) {
		return (
			<Button {...other} disabled>
				<Check />
			</Button>
		);
	} else if (loading) {
		return (
			<Button {...other}>
				<CircularProgress {...progressProps} />
			</Button>
		);
	} else {
		return <Button {...other} />;
	}
};

LoadingButton.defaultProps = {
	loading: false,
	done: false,
	progressProps: {},
};

LoadingButton.propTypes = {
	loading: PropTypes.bool,
	done: PropTypes.bool,
	progressProps: PropTypes.object,
};

export default LoadingButton;
