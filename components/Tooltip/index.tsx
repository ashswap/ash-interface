import ICCaretLeft from "assets/svg/caret-left.svg";
import ICCaretRight from "assets/svg/caret-right.svg";
import ICCaretUp from "assets/svg/caret-up.svg";
import ICCaretDown from "assets/svg/caret-down.svg";
import React, {
    cloneElement,
    CSSProperties,
    Fragment,
    isValidElement,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Placement,
    offset,
    flip,
    shift,
    autoUpdate,
    useFloating,
    useInteractions,
    useHover,
    useFocus,
    useRole,
    useDismiss,
    useFocusTrap,
    FloatingPortal,
    arrow,
    autoPlacement,
    safePolygon,
    Strategy,
} from "@floating-ui/react-dom-interactions";
import { Transition } from "@headlessui/react";

interface Props {
    open?: boolean;
    content: any;
    children: any;
    placement?: Placement;
    strategy?: Strategy;
    arrowStyle?: (pos: {
        x?: number;
        y?: number;
        centerOffset: number;
    }) => CSSProperties;
    onOpenChange?: (val: boolean) => void;
}
const Arrow = ({
    direction,
}: {
    direction?: "top" | "left" | "right" | "bottom";
}) => {
    return (
        <div
            className={`relative items-center ${
                direction
                    ? direction === "top" || direction === "bottom"
                        ? "flex flex-col"
                        : "flex"
                    : ""
            }`}
        >
            {direction === "top" && (
                <ICCaretUp className="absolute text-stake-green-500 w-2 h-2 top-0 -translate-y-full" />
            )}
            {direction === "left" && (
                <ICCaretLeft className="absolute text-stake-green-500 w-2 h-2 left-0 -translate-x-full" />
            )}
            <div
                className="m-0.5 border border-stake-green-500 w-5 h-5 flex items-center justify-center rotate-45 bg-transparent"
                style={{
                    boxShadow:
                        "0px 4px 20px rgba(0, 255, 117, 0.5), 0px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
            >
                <div className="bg-stake-green-500 w-2.5 h-2.5"></div>
            </div>
            {direction === "bottom" && (
                <ICCaretDown className="absolute text-stake-green-500 w-2 h-2 bottom-0 translate-y-full" />
            )}
            {direction === "right" && (
                <ICCaretRight className="absolute text-stake-green-500 w-2 h-2 right-0 translate-x-full" />
            )}
        </div>
    );
};
const Tooltip = (props: Props) => {
    const {
        open: openProp,
        children,
        content,
        placement = "top",
        strategy: strategyProp = "absolute",
        arrowStyle,
        onOpenChange: onOpenChangeProp,
    } = props;
    const [_open, _setOpen] = useState(false);
    const arrowRef = useRef(null);
    const open = useMemo(() => {
        console.log(
            Object.prototype.hasOwnProperty.call(props, "open"),
            props,
            _open
        );
        return Object.prototype.hasOwnProperty.call(props, "open")
            ? openProp
            : _open;
    }, [openProp, _open, props]);
    const onOpenChange = useCallback(
        (val: boolean) => {
            _setOpen(val);
            if (
                Object.prototype.hasOwnProperty.call(props, "onOpenChange") &&
                typeof onOpenChangeProp === "function"
            ) {
                onOpenChangeProp(val);
            }
        },
        [onOpenChangeProp, props]
    );
    const {
        x,
        y,
        reference,
        floating,
        strategy,
        context,
        refs,
        update,
        placement: realPlacement,
        middlewareData,
    } = useFloating({
        placement,
        open,
        onOpenChange,
        middleware: [
            offset(20),
            arrow({ element: arrowRef }),
            flip({fallbackStrategy: "initialPlacement"}),
            shift({ padding: 8 }),
        ],
        strategy: strategyProp,
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        useHover(context, {
            delay: { open: 1000 },
            restMs: 40,
            handleClose: safePolygon(),
        }),
        useFocus(context),
        useRole(context, { role: "tooltip" }),
        useDismiss(context, {ancestorScroll: true}),
        // useFocusTrap(context),
    ]);

    useEffect(() => {
        if (refs.reference.current && refs.floating.current && open) {
            return autoUpdate(
                refs.reference.current,
                refs.floating.current,
                update
            );
        }
    }, [refs.reference, refs.floating, update, open]);
    const { x: arrowX, y: arrowY, centerOffset } = middlewareData.arrow || {};
    const staticSide = useMemo(() => {
        return {
            top: "bottom",
            right: "left",
            bottom: "top",
            left: "right",
        }[realPlacement.split("-")[0]]!;
    }, [realPlacement]);

    return (
        <>
            {isValidElement(children) &&
                cloneElement(children, getReferenceProps({ ref: reference }))}
            <div
                {...getFloatingProps({
                    ref: floating,
                    className: "Tooltip outline-none",
                    style: {
                        position: strategy,
                        top: y ?? "",
                        left: x ?? "",
                        zIndex: 999,
                    },
                })}
            >
                <Transition
                    show={open}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    {content}
                    <div
                        ref={arrowRef}
                        className="absolute"
                        style={{
                            left: arrowX != null ? `${arrowX}px` : "",
                            top: arrowY != null ? `${arrowY}px` : "",
                            right: "",
                            bottom: "",
                            ...(typeof arrowStyle === "function" &&
                            middlewareData.arrow
                                ? arrowStyle(middlewareData.arrow)
                                : {}),
                            [staticSide]: "-11px",
                        }}
                    >
                        <Arrow direction={staticSide as any} />
                    </div>
                </Transition>
            </div>
        </>
    );
};

Tooltip.Arrow = Arrow;

export default Tooltip;
