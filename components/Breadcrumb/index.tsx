import Link from "next/link";
import React, { Fragment, memo, useMemo } from "react";
import ICArrowRight from "assets/svg/arrow-right.svg";
import customTwMerge from "helper/customTwMerge";

type Props = {
    links: Array<{ label: React.ReactNode; href?: string }>;
    separator?: React.ReactNode;
    className?: string;
};
function Breadcrumb({ links, separator, className }: Props) {
    const separatorEl = useMemo(() => {
        return separator || <ICArrowRight />;
    }, [separator]);
    return (
        <nav aria-label="breadcrumb">
            <ul
                className={customTwMerge(
                    "flex flex-wrap items-center space-x-1 mb-4 md:mb-[3.25rem] text-sm md:text-lg font-bold",
                    className
                )}
            >
                {links.map((b, i) => {
                    const content = (
                        <span
                            className={`${
                                i === links.length - 1
                                    ? "text-ash-gray-600"
                                    : "text-white"
                            }`}
                        >
                            {b.label}
                        </span>
                    );
                    return (
                        <Fragment key={b.href}>
                            <li>
                                {typeof b.href === "undefined" ? (
                                    content
                                ) : (
                                    <Link href={b.href}>{content}</Link>
                                )}
                            </li>
                            <li aria-hidden="true" className="last:hidden">
                                {separatorEl}
                            </li>
                        </Fragment>
                    );
                })}
            </ul>
        </nav>
    );
}

export default memo(Breadcrumb);
