import React from 'react';

export default function useUtilityHook() {
	const formifyObject = (object) => {
		const form = new FormData();
		for (const [name, value] of Object.entries(object)) {
			form.append(name, value);
		}
		return form;
	};

	const wrapPromise = async (promise) => {
		try {
			let data = await promise;
			return [data, null];
		} catch (error) {
			return [null, error];
		}
	};

	const isVerticalOverflow = (element) => {
		return element.scrollHeight > element.clientHeight;
	};

	return {
		formifyObject,
		wrapPromise,
		isVerticalOverflow,
	};
}
