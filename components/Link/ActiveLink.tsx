import { useRouter } from "next/router";
import { ReactNode, useMemo } from "react";

type ActiveLinkProps = Omit<
    React.DetailedHTMLProps<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
    >,
    "children"
> & {
    href: string;
    children: ReactNode | ((opt: { active: boolean }) => ReactNode);
    exact?: boolean;
};
const ActiveLink = ({ exact, onClick, ...props }: ActiveLinkProps) => {
    const router = useRouter();
    const { href } = props;

    const handleClick = (e: any) => {
        e.preventDefault();
        router.push(href);
        onClick?.(e);
    };

    const active = useMemo(() => {
        if (exact) {
            return router.pathname === href;
        }
        return href.startsWith(router.pathname);
    }, [href, router.pathname, exact]);

    return (
        <a {...props} onClick={handleClick}>
            {typeof props.children === "function"
                ? props.children({ active })
                : props.children}
        </a>
    );
};

export default ActiveLink;
