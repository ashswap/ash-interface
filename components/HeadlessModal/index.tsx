import { Dialog, Transition } from "@headlessui/react";
import IconClose from "assets/svg/close.svg";
import IconButton from "components/IconButton";
import { useRouter } from "next/router";
import React, {
    ElementType,
    Fragment,
    MutableRefObject,
    useEffect,
    useRef,
    useState
} from "react";
const TRANSITIONS = {
    center: {
        enter: "transition duration-200 ease-out",
        enterFrom: "transform scale-95 opacity-0",
        enterTo: "transform scale-100 opacity-100",
        leave: "transition duration-75 ease-out",
        leaveFrom: "transform scale-100 opacity-100",
        leaveTo: "transform scale-95 opacity-0"
    },
    btt: {
        enter: "transition duration-300 ease-in-out transform",
        enterFrom: "translate-y-full opacity-0",
        enterTo: "translate-y-0 opacity-100",
        leave: "transition duration-300 ease-out transform",
        leaveFrom: "translate-y-0 opacity-100",
        leaveTo: "translate-y-full opacity-0"
    },
    none: {}
};
interface props {
    open: boolean;
    onClose: (val: boolean) => void;
    initialFocus?: MutableRefObject<HTMLElement | null> | undefined;
    as?: ElementType | undefined;
    static?: boolean;
    title?: string;
    description?: string;
    className?: string;
    children?: any;
    transition?: "btt" | "center" | "none";
    direction?: "btt" | "center" | "none";
}
function HeadlessModal({
    open,
    onClose,
    initialFocus,
    as,
    title,
    description,
    className,
    children,
    transition,
    direction,
    ...rest
}: props) {
    const trans = TRANSITIONS[transition || "center"];
    const [animating, setAnimating] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { events } = useRouter();
    useEffect(() => {
        const onRouteChange = () => onClose(false);
        events.on("routeChangeComplete", onRouteChange);
        return events.off("routeChangeComplete", onRouteChange);
    }, [events, onClose]);
    return (
        <>
            <Transition show={open} as={Fragment}>
                <Dialog
                    open={open}
                    onClose={onClose}
                    initialFocus={initialFocus}
                    as={as || "div"}
                    static={rest.static || false}
                    className={`fixed inset-0 z-[999] ${className}`}
                >
                    <div className="relative inset-0 w-full h-full overflow-hidden">
                        <Transition.Child
                            as={Fragment}
                            enter="transition duration-300 ease-out"
                            enterFrom="transform opacity-0"
                            enterTo="transform opacity-100"
                            leave="transition duration-100 ease-out"
                            leaveFrom="transform opacity-100"
                            leaveTo="transform opacity-0"
                        >
                            <Dialog.Overlay className="bg-ash-purple-500/20 backdrop-blur-[30px] absolute inset-0" />
                        </Transition.Child>
                        {/* <Dialog.Title>{title}</Dialog.Title>
                        <Dialog.Description>{description}</Dialog.Description> */}

                        <div
                            className={`absolute inset-0 ${
                                animating ? "overflow-hidden" : "overflow-auto"
                            }`}
                            ref={containerRef}
                            onClick={e => {
                                e.target === containerRef.current &&
                                    onClose(false);
                            }}
                        >
                            <Transition.Child
                                as={Fragment}
                                {...trans}
                                beforeEnter={() => setAnimating(true)}
                                afterEnter={() => setAnimating(false)}
                                beforeLeave={() => setAnimating(true)}
                                afterLeave={() => setAnimating(false)}
                            >
                                {children}
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}

export function HeadlessModalDefaultHeader({
    onClose
}: Pick<props, "onClose">) {
    return (
        <div className="flex justify-end">
            <IconButton
                icon={<IconClose />}
                iconSize="small"
                onClick={() => onClose(false)}
                className="bg-ash-dark-700"
            />
        </div>
    );
}

export default HeadlessModal;
