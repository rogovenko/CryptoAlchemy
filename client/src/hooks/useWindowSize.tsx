import { useState, useEffect } from 'react';

export default function useWindowSize() {
  const [width, setWidth] = useState<number>(0);
	const [height, setHeight] = useState<number>(0);

	const handleResize = () => {
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);
	};

  useEffect(() => {
		handleResize();
		if (typeof window !== "undefined") {
			window.addEventListener("resize", handleResize);
		}
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { width, height };
}
