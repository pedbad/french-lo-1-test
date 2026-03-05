export const handleResponse = (response) => {
	// Used in all API calls
	if (response.status === 204) return Promise.resolve(true);
	return response.json()
		.then((json) => {
			if (!response.ok) {
				const error = {
					...json,
					...{
						message: json.message,
						status: response.status,
						statusText: response.statusText,
					}
				};
				return Promise.reject(error);
			}
			return json;
		});
};

export const handleResponseCSV = (response) => {
	// Used in all CSV API calls
	if (response.status === 204 /* || response.status === 200 */) return Promise.resolve(true);
	return response.text()
		.then((text) => {
			let error = '';
			if (response.status === 404) {
				error = { message: 'Sorry, file is unavailable at this time' };
				return Promise.reject(error);
			}
			if (!response.ok) {
				if (typeof text === 'string') {
					try {
						error = JSON.parse(text);
					}
					catch {
						error = { message: text };
					}
					return Promise.reject(error);
				}

				error = {
					...text,
					...{
						message: text.message,
						status: response.status,
						statusText: response.statusText,
					}
				};
				return Promise.reject(error);
			}
			return text;
		});
};

export const handleResponseText = (response) => {
	// Used in all API calls
	if (response.status === 204) return Promise.resolve(true);
	return response.text()
		.then((res) => {
			if (!response.ok) {
				const error = {
					...res,
					...{
						message: res.message,
						status: response.status,
						statusText: response.statusText,
					}
				};
				return Promise.reject(error);
			}
			return res;
		});
};
