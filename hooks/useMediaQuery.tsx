import { useEffect, useState } from "react";

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        let listener: any;
        const unsuport =
            typeof window === "undefined" ||
            typeof window.matchMedia === "undefined";
        if (unsuport) {
            setMatches(false);
        } else {
            listener = () => {
                const media = window.matchMedia(query);
                setMatches(media.matches);
            };
            listener();
            window.addEventListener("resize", listener);
        }

        return () => {
            !unsuport &&
                !!listener &&
                window.removeEventListener("resize", listener);
        };
    }, [query]);

    return matches;
};

export default useMediaQuery;
