import customTwMerge from "helper/customTwMerge";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
type Props = Parameters<typeof Link>[0] & {exact?: boolean};
function NavLink({ className, children, exact, ...props }: Props) {
    const router = useRouter();
    const isActive = useMemo(
        () => {
            return exact
                ? router.route === props.href.toString()
                : router.route.startsWith(props.href.toString());
        },
        [exact, props.href, router.route]
    );
    return (
        <Link {...props}>
            <span
                className={customTwMerge(
                    "transition w-full sm:min-w-[5rem] md:w-auto h-12 md:h-10 px-2 md:px-4 inline-flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 font-bold text-2xs md:text-xs text-stake-gray-500 hover:text-white hover:bg-ash-dark-600",
                    isActive ? "bg-ash-dark-600 text-white" : "",
                    className
                )}
            >
                {children}
            </span>
        </Link>
    );
}

export default NavLink;
