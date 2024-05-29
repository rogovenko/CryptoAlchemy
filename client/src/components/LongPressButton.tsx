import React, { useRef, useCallback } from "react";

interface LongPressButtonProps {
	onLongPress: () => void;
	ms: number;
	imgPath: string;
	className?: string,
}

const LongPressButton: React.FC<LongPressButtonProps> = ({ onLongPress, ms, imgPath, className }) => {
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const animationRef = useRef<HTMLDivElement | null>(null);

	const startPress = useCallback(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}
		if (animationRef.current) {
			animationRef.current.classList.add("animate-bg-transition");
		}
		timerRef.current = setTimeout(onLongPress, ms);
	}, [onLongPress, ms]);

	const endPress = useCallback(() => {
		if (animationRef.current) {
			animationRef.current.classList.remove("animate-bg-transition");
		}
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	}, []);

	const preventDefault = useCallback((e: React.MouseEvent | React.TouchEvent) => {
		e.preventDefault();
	}, []);

	return (
		<div className="relative w-full h-full flex justify-center items-center">
			<picture className={`absolute z-10 ${className}`}>
				<source srcSet={imgPath} type="image/webp" />
				<img
					onMouseDown={startPress}
					onMouseUp={endPress}
					onMouseLeave={endPress}
					onTouchStart={startPress}
					onTouchEnd={endPress}
					onContextMenu={preventDefault}
					className={`full-select-none select-none object-cover w-full h-full`}
					src={imgPath}
					alt="Long Press Button Image"
					draggable="false"
					/>
			</picture>
			<div
				className={`rounded-lg border animated-bg ${className}`}
				ref={animationRef}
				/>
		</div>
	);
};

export default LongPressButton;

