import IconClose from "assets/svg/close.svg";
import IconButton from "components/IconButton";
import { PanelV2 } from "components/Panel";
import Modal, { Props } from "react-modal";
Modal.defaultStyles.overlay = {
    backgroundColor: "rgba(123, 97, 255, 0.2)",
    backdropFilter: "blur(30px)",
    position: "fixed",
    zIndex: 999,
    inset: "0px",
    overflow: "auto"
};
Modal.defaultStyles.content = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    border: "none",
    overflow: "auto hidden",
    outline: "none",
    maxHeight: "100vh"
};
Modal.setAppElement("body");
const ReactModel = (props: Props & { contentClassName?: string }) => {
    return (
        <Modal {...props}>
            <PanelV2 className="text-base text-ash-dark-600 ">
                <div
                    className={`relative max-h-[calc(100vh-2rem)] ${props.contentClassName}`}
                >
                    <div className="absolute top-0 right-0">
                        <IconButton
                            icon={<IconClose />}
                            iconSize="small"
                            onClick={props.onRequestClose}
                            className="bg-ash-dark-700"
                        />
                    </div>
                    {props.children}
                </div>
            </PanelV2>
        </Modal>
    );
};
export default ReactModel;
