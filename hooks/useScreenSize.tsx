import { TAILWIND_BREAKPOINT } from "const/mediaQueries";
import useMediaQuery from "./useMediaQuery";
export const useScreenSize = () => {
    const msm = useMediaQuery(`(max-width: ${TAILWIND_BREAKPOINT.SM - 1}px)`);
    const sm = useMediaQuery(`(min-width: ${TAILWIND_BREAKPOINT.SM}px)`);
    const md = useMediaQuery(`(min-width: ${TAILWIND_BREAKPOINT.MD}px)`);
    const lg = useMediaQuery(`(min-width: ${TAILWIND_BREAKPOINT.LG}px)`);
    const xl = useMediaQuery(`(min-width: ${TAILWIND_BREAKPOINT.XL}px)`);
    const xl2 = useMediaQuery(`(min-width: ${TAILWIND_BREAKPOINT["2XL"]}px)`);
    return { msm, sm, md, lg, xl, xl2, isMobile: msm };
};
