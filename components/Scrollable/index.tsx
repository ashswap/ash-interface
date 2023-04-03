import customTwMerge from "helper/customTwMerge";
import React, { useRef, useEffect, useMemo } from "react";

interface Props {
    children: React.ReactNode;
    direction?: "horizontal" | "vertical";
    className?: string;
}

const Scrollable = React.memo(function Scrollable({
    children,
    direction = "vertical",
    className,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    const mergedClassName = useMemo(() => {
        return customTwMerge(
            `${
                direction === "horizontal"
                    ? "overflow-x-scroll"
                    : "overflow-y-auto"
            } flex`,
            className
        );
    }, [direction, className]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            const handleWheel = (event: WheelEvent) => {
                event.preventDefault();
                const isMouse = Math.abs(event.deltaY) >= 30;
                if (direction === "horizontal") {
                    container.scrollLeft += isMouse
                        ? event.deltaY
                        : Math.abs(event.deltaX) > Math.abs(event.deltaY)
                        ? event.deltaX
                        : event.deltaY;
                } else {
                    container.scrollTop += event.deltaY;
                }
            };
            container.addEventListener("wheel", handleWheel, {
                passive: false,
            });
            return () => container.removeEventListener("wheel", handleWheel);
        }
    }, [direction]);

    return (
        <div ref={containerRef} className={mergedClassName}>
            {children}
        </div>
    );
});

export default Scrollable;
