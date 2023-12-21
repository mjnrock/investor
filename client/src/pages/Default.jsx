import { useEffect, useState } from "react";

export function Default() {
	const [ state, setState ] = useState({
		"message": "Loading...",
	});

	useEffect(() => {
		fetch("https://buddha.com:3801/")
			.then((res) => res.json())
			.then((data) => setState(data));
	}, []);

	return (
		<div>
			<h1>API</h1>

			<pre>
				{ JSON.stringify(state, null, 2) }
			</pre>
		</div>
	);
};

export default Default;