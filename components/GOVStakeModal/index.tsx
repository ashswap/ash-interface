import { useStakeGov } from "context/gov";
import { useState } from "react";
import FirstStakeModal from "./FirstStakeModal";
import StakeMoreModal from "./StakeMoreModal";

type props = {
    open: boolean;
    onClose: () => void;
};
function GOVStakeModal({ open, onClose }: props) {
    const {lockedAmt} = useStakeGov();

    return (
        <>
            {lockedAmt && lockedAmt.gt(0) ? (
                <StakeMoreModal open={open} onClose={onClose} />
            ) : (
                <FirstStakeModal open={open} onClose={onClose} />
            )}
        </>
    );
}

export default GOVStakeModal;
