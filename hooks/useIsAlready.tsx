import { useEffect, useState } from "react";

const useIsAlready = (val: any, expected: any) => {
    const [isAlready, setIsAlready] = useState(false);
    useEffect(() => {
        if(val === expected){
            setIsAlready(true);
        }
    }, [val, expected]);

    return isAlready;
}
export default useIsAlready;