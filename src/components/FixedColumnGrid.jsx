import React from 'react';

export default function FixedColumnGrid(props) {
	const { rowStyle, rowSpacing, style, columns, ...other } = props;

	const chunkify = (array, chunk) => {
		const chunks = [];
		for (let i = 0; i < array.length; i += chunk) {
			const _chunk = array.slice(i, i + chunk);
			chunks.push(_chunk);
		}
		return chunks;
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				...style,
			}}
			{...other}
		>
			{chunkify(props.children, columns).map((chunk, index) => {
				return (
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							...rowStyle,
						}}
						key={`${props.name}-chunk-${index}`}
					>
						{chunk.map((item, _index) => {
							return (
								<div
									style={{
										marginRight: _index >= chunk.length - 1 ? '0px' : rowSpacing,
									}}
									key={`${props.name}-chunk-${index}-item-${_index}`}
								>
									{item}
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
}
