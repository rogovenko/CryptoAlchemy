import { memo } from "react";

const Loader = memo(() => {
	return (
	<div className="flex items-center justify-center w-full h-full">
		<div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
	</div>
	)
})

export default Loader;