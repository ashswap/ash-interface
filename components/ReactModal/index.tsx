import { Transition } from "@headlessui/react";
import IconClose from "assets/svg/close.svg";
import { createContext, Fragment, useContext, useMemo, useState } from "react";
import Modal, { Props } from "react-modal";
const TRANSITIONS: Record<string, any> = {
    center: {
        enter: "transition duration-200 ease-out",
        enterFrom: "transform scale-95 opacity-0",
        enterTo: "transform scale-100 opacity-100",
        leave: "transition duration-75 ease-out",
        leaveFrom: "transform scale-100 opacity-100",
        leaveTo: "transform scale-95 opacity-0",
    },
    btt: {
        enter: "transition duration-300 ease-in-out transform",
        enterFrom: "translate-y-full opacity-0",
        enterTo: "translate-y-0 opacity-100",
        leave: "transition duration-300 ease-out transform",
        leaveFrom: "translate-y-0 opacity-100",
        leaveTo: "translate-y-full opacity-0",
    },
    none: {},
};
const CONTAINER = {
    drawer_btt: "fixed bottom-0 left-0 right-0",
    drawer_ttb: "fixed top-0 left-0 right-0",
    drawer_ltr: "fixed bottom-0 left-0 top-0",
    drawer_rtl: "fixed bottom-0 top-0 right-0",
    modal: "",
};
Modal.setAppElement("body");
type ReactModalType = Props & {
    transition?: "btt" | "center" | "none";
    type?: "modal" | "drawer_btt" | "drawer_ttb" | "drawer_ltr" | "drawer_rtl";
};
const ModalContext = createContext<ReactModalType>({ isOpen: false });

const ReactModal = (props: ReactModalType) => {
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
    return (
        <ModalContext.Provider value={{ ...props }}>
            <Transition show={props.isOpen} as={"div"}>
                <Modal
                    shouldCloseOnEsc={true}
                    shouldCloseOnOverlayClick={true} closeTimeoutMS={200}
                    {...reactModalProps}
                    overlayElement={(props, contentElement) => (
                        <div
                            {...props}
                            style={{}}
                            className="overflow-auto fixed z-[999] inset-0 py-8 flex items-center justify-center"
                        >
                            {contentElement}
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
                        enterFrom="transform opacity-0"
                        enterTo="transform opacity-100"
                        leave="transition duration-100 ease-out"
                        leaveFrom="transform opacity-100"
                        leaveTo="transform opacity-0"
                    >
                        <div className="bg-ash-purple-500/20 backdrop-blur-[30px] absolute z-[-1] inset-0 pointer-events-none"></div>
                    </Transition.Child>
                    <Transition.Child
                        as={Fragment}
                        {...trans}
                        beforeEnter={() => setAnimating(true)}
                        afterEnter={() => setAnimating(false)}
                        beforeLeave={() => setAnimating(true)}
                        afterLeave={() => setAnimating(false)}
                    >
                        <div className={`${CONTAINER[type]}`}>
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
ReactModal.CloseBtn = CloseBtn;
export default ReactModal;
