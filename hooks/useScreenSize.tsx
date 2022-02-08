import { TAILWIND_BREAKPOINT } from "const/mediaQueries";
import useMediaQuery from "./useMediaQuery";
export const useScreenSize = () => {
    const sm = useMediaQuery(`(max-width: ${TAILWIND_BREAKPOINT.SM}px)`);
    const md = useMediaQuery(`(max-width: ${TAILWIND_BREAKPOINT.MD}px)`);
    const lg = useMediaQuery(`(max-width: ${TAILWIND_BREAKPOINT.LG}px)`);
    const xl = useMediaQuery(`(max-width: ${TAILWIND_BREAKPOINT.XL}px)`);
    const xl2 = useMediaQuery(`(max-width: ${TAILWIND_BREAKPOINT["2XL"]}px)`);
    return { sm, md, lg, xl, xl2 };
};
