export function request(url, method, data) {
	const options = {
		method: method || 'GET',
	};

	if (data) {
		if (!(data instanceof FormData)) {
			options.headers = {
				'Content-Type': 'application/json;charset=utf-8',
			};
			options.body = JSON.stringify(data);
		} else {
			options.body = data;
		}
	}

	return fetch('/api' + url, options).then((res) => res.json());
}
