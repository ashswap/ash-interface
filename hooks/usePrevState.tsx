import { useEffect, useRef, useState } from "react";

function usePrevState<T>(state: T) {
    const [prev, setPrev] = useState<T>();
    const currentRef = useRef<T>();
    useEffect(() => {
        setPrev(currentRef.current);
        currentRef.current = state;
    }, [state]);
    return prev;
}

export default usePrevState;