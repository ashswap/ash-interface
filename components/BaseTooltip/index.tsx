import ICCaretLeft from "assets/svg/caret-left.svg";
import ICCaretRight from "assets/svg/caret-right.svg";
import ICCaretUp from "assets/svg/caret-up.svg";
import ICCaretDown from "assets/svg/caret-down.svg";
import ICClose from "assets/svg/close.svg";
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
    size,
    Dimensions,
    ElementRects,
    detectOverflow,
    hide,
} from "@floating-ui/react-dom-interactions";
import { Transition } from "@headlessui/react";
import { theme } from "tailwind.config";

export type BaseTooltipProps = {
    open?: boolean;
    content:
        | JSX.Element
        | ((args: { size?: Dimensions & ElementRects }) => JSX.Element);
    children: JSX.Element;
    placement?: Placement;
    strategy?: Strategy;
    autoPlacement?: boolean;
    zIndex?: number;
    arrow?:
        | JSX.Element
        | ((
              pos: {
                  x?: number;
                  y?: number;
                  centerOffset: number;
              },
              staticSide: "top" | "left" | "bottom" | "right"
          ) => JSX.Element);
    delayOpen?: number;
    offset?: Parameters<typeof offset>[0];
    arrowStyle?: (
        pos: {
            x?: number;
            y?: number;
            centerOffset: number;
        },
        staticSide: "top" | "left" | "bottom" | "right"
    ) => CSSProperties;
    onOpenChange?: (val: boolean) => void;
};

const BaseTooltip = (props: BaseTooltipProps) => {
    const {
        open: openProp,
        children,
        content,
        placement = "top",
        strategy: strategyProp = "absolute",
        zIndex,
        arrowStyle,
        onOpenChange: onOpenChangeProp,
        arrow: customArrow,
        autoPlacement: useAutoPlacement,
        delayOpen = 0,
        offset: offsetParam = 20,
    } = props;
    const [_open, _setOpen] = useState(false);
    const arrowRef = useRef(null);
    const [sizeState, setSizeState] = useState<Dimensions & ElementRects>();
    const [isOverflow, setIsOverflow] = useState(false);
    const [open, setOpen] = useState(false);
    const computedOpen = useMemo(() => {
        if (isOverflow) return false;
        return Object.prototype.hasOwnProperty.call(props, "open")
            ? !!openProp
            : _open;
    }, [openProp, _open, props, isOverflow]);
    useEffect(() => {
        const timer = setTimeout(
            () => {
                setOpen(computedOpen);
            },
            computedOpen ? delayOpen : 0
        );
        return () => clearTimeout(timer);
    }, [delayOpen, computedOpen]);
    const onOpenChange = useCallback(
        (val: boolean) => {
            _setOpen(val);
            onOpenChangeProp?.(val);
        },
        [onOpenChangeProp]
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
            offset(offsetParam),
            arrow({ element: arrowRef }),
            size({
                apply(args) {
                    setSizeState(args);
                },
            }),
            useAutoPlacement
                ? autoPlacement()
                : flip({ fallbackStrategy: "initialPlacement" }),
            shift({ padding: 8 }),
            hide(),
        ],
        strategy: strategyProp,
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        useHover(context, {
            delay: { open: 200 },
            restMs: 40,
            handleClose: safePolygon(),
        }),
        useFocus(context),
        useRole(context, { role: "tooltip" }),
        useDismiss(context, { ancestorScroll: true }),
        // useFocusTrap(context),
    ]);

    useEffect(() => {
        let cleanup = () => {};
        if (refs.reference.current && refs.floating.current && open) {
            cleanup = autoUpdate(
                refs.reference.current,
                refs.floating.current,
                update
            );
        }
        return () => cleanup();
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
            <FloatingPortal>
                <div
                    {...getFloatingProps({
                        ref: floating,
                        className: "Tooltip outline-none group",
                        style: {
                            position: strategy,
                            top: y ?? "",
                            left: x ?? "",
                            zIndex: zIndex ?? theme.extend.zIndex.tooltip,
                            visibility: middlewareData.hide?.referenceHidden
                                ? "hidden"
                                : "visible",
                        },
                    })}
                >
                    <Transition
                        show={!!open}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        {typeof content === "function"
                            ? content({ size: sizeState })
                            : content}
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
                                    ? arrowStyle(
                                          middlewareData.arrow,
                                          staticSide as any
                                      )
                                    : {}),
                            }}
                        >
                            {customArrow ? (
                                typeof customArrow === "function" ? (
                                    middlewareData?.arrow ? (
                                        customArrow(
                                            middlewareData.arrow,
                                            staticSide as any
                                        )
                                    ) : (
                                        <></>
                                    )
                                ) : (
                                    customArrow
                                )
                            ) : (
                                <></>
                            )}
                        </div>
                    </Transition>
                </div>
            </FloatingPortal>
        </>
    );
};

export default BaseTooltip;
