import { useState } from "react";
import FirstStakeModal from "./FirstStakeModal";
import StakeMoreModal from "./StakeMoreModal";

type props = {
    open: boolean;
    onClose: () => void;
};
function GOVStakeModal({ open, onClose }: props) {
    const [isStaked, setIsStaked] = useState(false);
    return (
        <>
            {isStaked ? (
                <StakeMoreModal open={open} onClose={onClose} />
            ) : (
                <FirstStakeModal open={open} onClose={onClose} />
            )}
        </>
    );
}

export default GOVStakeModal;
