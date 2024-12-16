import { useEffect, useState } from "react";

export default function useInnerWidth() {
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);
    
    const resize = () => {
        setInnerWidth(window.innerWidth);  
    };

    useEffect(() => {
        window.addEventListener("resize", resize);

        return () => {
            window.removeEventListener("resize", resize);
        }
    }, []);

    return innerWidth;
}
