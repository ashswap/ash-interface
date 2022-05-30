import { useEffect } from "react";

const useInterval = (callback: Function, timeout?: number) => {
    useEffect(() => {
        callback();
        const interval = setInterval(callback, timeout);
        return () => clearInterval(interval);
    }, [callback, timeout]);
};

export default useInterval;
