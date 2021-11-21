import Panel, { PanelContent } from "components/Panel";
import IconButton from "components/IconButton";
import IconClose from "assets/svg/close.svg";

interface Props {
    open?: boolean;
    onClose?: () => void;
    children?: any;
    contentClassName?: string | undefined;
    dark?: "600" | "650" | "700";
}

const Modal = (props: Props) => {
    if (!props.open) {
        return null;
    }

    return (
        <div className="bg-bg-overlay fixed left-0 right-0 top-0 bottom-0 z-50 bg-opacity-20 backdrop-filter backdrop-blur-sm">
            <div
                className="absolute left-0 top-0 right-0 bottom-0"
                onClick={props.onClose}
            />
            <Panel dark={props.dark} style={{marginTop: 100}}>
                <PanelContent className={props.contentClassName}>
                    <div className="absolute top-4 right-4">
                        <IconButton
                            icon={<IconClose />}
                            onClick={props.onClose}
                            className="bg-ash-dark-700"
                        />
                    </div>
                    {props.children}
                </PanelContent>
            </Panel>
        </div>
    );
};

export default Modal;
