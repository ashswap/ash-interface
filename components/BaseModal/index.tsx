import { Transition, TransitionClasses } from "@headlessui/react";
import IconClose from "assets/svg/close.svg";
import {
    createContext,
    Fragment,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import Modal, { Props } from "react-modal";
const TRANSITIONS: Record<string, TransitionClasses> = {
    center: {
        enter: "transition duration-200 ease-out",
        enterFrom: "scale-95 opacity-0",
        enterTo: "scale-100 opacity-100",
        leave: "transition duration-75 ease-out",
        leaveFrom: "scale-100 opacity-100",
        leaveTo: "scale-95 opacity-0",
    },
    btt: {
        enter: "transition duration-300 ease-in-out",
        enterFrom: "translate-y-full opacity-0",
        enterTo: "translate-y-0 opacity-100",
        leave: "transition duration-300 ease-out",
        leaveFrom: "translate-y-0 opacity-100",
        leaveTo: "translate-y-full opacity-0",
    },
    none: {},
};
const CONTAINER = {
    drawer_btt: "fixed max-h-full bottom-0 left-0 right-0",
    drawer_ttb: "fixed max-h-full top-0 left-0 right-0",
    drawer_ltr: "fixed max-w-full bottom-0 left-0 top-0",
    drawer_rtl: "fixed max-w-full bottom-0 top-0 right-0",
    modal: "",
};
Modal.setAppElement("body");
export type BaseModalType = Props & {
    transition?: "btt" | "center" | "none";
    type?: "modal" | "drawer_btt" | "drawer_ttb" | "drawer_ltr" | "drawer_rtl";
};
const ModalContext = createContext<BaseModalType>({ isOpen: false });

const BaseModal = (props: BaseModalType) => {
    const { transition, type = "modal", ...reactModalProps } = props;
    const [animating, setAnimating] = useState(false);
    const trans = useMemo(() => {
        return (
            TRANSITIONS[
                transition || type === "modal"
                    ? "center"
                    : type.replace("drawer_", "")
            ] || {}
        );
    }, [transition, type]);
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (
                props.isOpen &&
                window.innerWidth > window.document.body.clientWidth
            ) {
                window.document.body.style.paddingRight =
                    window.innerWidth - window.document.body.clientWidth + "px";
            } else {
                window.document.body.style.paddingRight = "";
            }
            window.document.body.style.overflow = props.isOpen ? "hidden" : "";
        }
    }, [props.isOpen]);
    return (
        <ModalContext.Provider value={{ ...props }}>
            <Transition show={props.isOpen} as={"div"}>
                <Modal
                    shouldCloseOnEsc={true}
                    shouldCloseOnOverlayClick={true}
                    closeTimeoutMS={200}
                    {...reactModalProps}
                    bodyOpenClassName={`${reactModalProps.bodyOpenClassName}`}
                    overlayElement={(props, contentElement) => (
                        <div
                            {...props}
                            style={{}}
                            className="overflow-auto fixed z-modal inset-0 py-8 "
                        >
                            <div className="flex items-center justify-center min-h-full">
                                {contentElement}
                            </div>
                        </div>
                    )}
                    contentElement={(props, children) => (
                        <div {...props} style={{}} className="">
                            {children}
                        </div>
                    )}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="transition duration-300 ease-out"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition duration-100 ease-out"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="bg-ash-purple-500/20 backdrop-blur-[30px] fixed z-[-1] inset-0 pointer-events-none"></div>
                    </Transition.Child>
                    <Transition.Child
                        as={Fragment}
                        {...trans}
                        beforeEnter={() => setAnimating(true)}
                        afterEnter={() => setAnimating(false)}
                        beforeLeave={() => setAnimating(true)}
                        afterLeave={() => setAnimating(false)}
                    >
                        <div
                            className={`${CONTAINER[type]} ${props.className}`}
                        >
                            {props.children}
                        </div>
                    </Transition.Child>
                </Modal>
            </Transition>
        </ModalContext.Provider>
    );
};
const CloseBtn = () => {
    const { onRequestClose } = useContext(ModalContext);
    return (
        <button
            className="w-10 h-10 flex items-center justify-center text-white bg-ash-dark-700 active:bg-ash-dark-400 hover:bg-ash-dark-500"
            onClick={onRequestClose}
        >
            <IconClose className="text-white" />
        </button>
    );
};
BaseModal.CloseBtn = CloseBtn;
export default BaseModal;
