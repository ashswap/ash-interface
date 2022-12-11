import { govLockedAmtState } from "atoms/govState";
import { useRecoilValue } from "recoil";
import FirstStakeModal from "./FirstStakeModal";
import StakeMoreModal from "./StakeMoreModal";

type props = {
    open: boolean;
    onClose: () => void;
};
function GOVStakeModal({ open, onClose }: props) {
    const lockedAmt = useRecoilValue(govLockedAmtState);

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
