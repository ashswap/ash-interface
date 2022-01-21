import { useEffect, useState } from "react";
import platform from "platform";
export function usePlatform(){
    const [isMobileOS, setIsMobileOS] = useState(false);
    useEffect(() => {
        const os = platform.os?.family?.toLocaleLowerCase()
        setIsMobileOS(os === "ios" || os === "android");
    }, []);
    return {
        isMobileOS
    }
}