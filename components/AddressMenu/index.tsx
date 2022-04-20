import {
    logout,
    useGetAccountInfo,
    useGetLoginInfo
} from "@elrondnetwork/dapp-core";
import IconChange from "assets/svg/change.svg";
import IconCopy from "assets/svg/copy.svg";
import IconDisconnect from "assets/svg/disconnect.svg";
import BaseModal from "components/BaseModal";
import BasePopover from "components/BasePopover";
import { TAILWIND_BREAKPOINT } from "const/mediaQueries";
import { useWallet } from "context/wallet";
import useMediaQuery from "hooks/useMediaQuery";
import useMounted from "hooks/useMounted";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState
} from "react";
type AddressMenuProp = {
    infoLayout?: boolean;
    dropdownBtn: (
        address: string,
        setMShowMenu: Dispatch<SetStateAction<boolean>>
    ) => JSX.Element;
    connectBtn: (
        connectWallet: (token?: string | undefined) => void
    ) => JSX.Element;
};
function AddressMenu({ infoLayout, dropdownBtn, connectBtn }: AddressMenuProp) {
    const { isLoggedIn: loggedIn } = useGetLoginInfo();
    const { address } = useGetAccountInfo();
    const logoutDapp = logout;
    const [mShowMenu, setMShowMenu] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const mounted = useMounted();
    const isSMScreen = useMediaQuery(
        `(max-width: ${TAILWIND_BREAKPOINT.SM}px)`
    );
    const { connectWallet, setIsOpenConnectWalletModal } = useWallet();
    useEffect(() => {
        setMShowMenu(false);
        setShowMenu(false);
    }, [isSMScreen]);
    const copyAddress = useCallback(() => {
        if (!loggedIn) {
            return;
        }
        setMShowMenu(false);
        setShowMenu(false);
        navigator.clipboard.writeText(address);
    }, [loggedIn, address]);
    useEffect(() => {
        if (loggedIn) {
            setShowMenu(false);
            setMShowMenu(false);
        }
    }, [loggedIn]);

    return (
        <div>
            <div>
                {mounted &&
                    (loggedIn ? (
                        <BasePopover
                            options={{ strategy: "fixed" }}
                            button={() => (
                                <div>{dropdownBtn(address, setMShowMenu)}</div>
                            )}
                        >
                            {({ close }) => (
                                <div className="bg-ash-dark-700">
                                    <button
                                        className={`w-full py-2 px-3 flex items-center overflow-hidden text-white hover:text-white transition-all font-bold text-xs hover:bg-ash-dark-500`}
                                        onClick={() => {
                                            copyAddress();
                                            close();
                                        }}
                                    >
                                        <IconCopy className="w-5 h-5 text-ash-gray-600 mr-3.5" />
                                        <span>Copy address</span>
                                    </button>
                                    <button
                                        className={`w-full py-2 px-3 flex items-center overflow-hidden text-white hover:text-white transition-all font-bold text-xs hover:bg-ash-dark-500`}
                                        onClick={() => {
                                            setIsOpenConnectWalletModal(true);
                                            close();
                                        }}
                                    >
                                        <IconChange className="w-5 h-5 text-ash-gray-600 mr-3.5" />
                                        <span>Change wallet</span>
                                    </button>
                                    <button
                                        className={`w-full py-2 px-3 flex items-center overflow-hidden text-white hover:text-white transition-all font-bold text-xs hover:bg-ash-dark-500`}
                                        onClick={() => {
                                            logoutDapp();
                                            close();
                                        }}
                                    >
                                        <IconDisconnect className="w-5 h-5 text-ash-gray-600 mr-3.5" />
                                        <span>Disconnect wallet</span>
                                    </button>
                                </div>
                            )}
                        </BasePopover>
                    ) : (
                        <>{connectBtn(connectWallet)}</>
                    ))}
            </div>
            {isSMScreen && (
                <BaseModal
                    isOpen={mShowMenu}
                    onRequestClose={() => setMShowMenu(false)}
                    type="drawer_btt"
                    className="clip-corner-4 clip-corner-tl bg-ash-dark-600 p-4 flex flex-col max-h-full text-white"
                >
                    <div className="flex justify-end">
                        <BaseModal.CloseBtn />
                    </div>
                    <div className="mt-1 px-6 pb-4 overflow-auto">
                        <div className="text-lg font-bold mb-7">
                            Wallet actions
                        </div>
                        <div className="text-sm">
                            <button
                                className="bg-bg rounded-lg px-11 h-14 flex items-center w-full mt-4"
                                onClick={copyAddress}
                            >
                                <i className="mr-4">
                                    <IconCopy className="h-7 w-7 text-ash-gray-500" />
                                </i>
                                <span>Copy address</span>
                            </button>
                            <button className="bg-bg rounded-lg px-11 h-14 flex items-center w-full mt-4">
                                <i className="mr-4">
                                    <IconChange className="h-7 w-7" />
                                </i>
                                <span>Change wallet</span>
                            </button>
                            <button
                                className="bg-bg rounded-lg px-11 h-14 flex items-center w-full mt-4"
                                onClick={() => {
                                    setMShowMenu(false);
                                    logoutDapp();
                                }}
                            >
                                <i className="mr-4">
                                    <IconDisconnect className="h-7 w-7" />
                                </i>
                                <span>Disconnect wallet</span>
                            </button>
                        </div>
                    </div>
                </BaseModal>
            )}
            {/* <Modal
                isOpen={isOpenWalletConnect}
                onRequestClose={() => setIsOpenWalletConnect(false)}
                useClipCorner={true}
            >
                <div className="p-12">
                    <WalletConnect
                        onLogin={() => setIsOpenWalletConnect(false)}
                    ></WalletConnect>
                </div>
            </Modal> */}
        </div>
    );
}

export default AddressMenu;
