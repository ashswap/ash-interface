import { useEffect, useState } from "react";

function Delayed({ children, wait }: { children: any; wait: number }) {
    const [hidden, setHidden] = useState(true);
    useEffect(() => {
        setTimeout(() => setHidden(false), wait);
    }, [wait]);
    return hidden ? null : children;
}

export default Delayed;
