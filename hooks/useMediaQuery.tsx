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
            const media = window.matchMedia(query);
            if (media.matches !== matches) {
                setMatches(media.matches);
            }
            listener = () => setMatches(media.matches);
            window.addEventListener("resize", listener);
        }

        return () => {
            !unsuport &&
                !!listener &&
                window.removeEventListener("resize", listener);
        };
    }, [matches, query]);

    return matches;
};

export default useMediaQuery;
