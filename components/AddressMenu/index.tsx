import { Button as AntdButton, Dropdown, Menu } from "antd";
import Avatar from "assets/images/avatar.png";
import IconChange from "assets/svg/change.svg";
import IconCopy from "assets/svg/copy.svg";
import IconDisconnect from "assets/svg/disconnect.svg";
import IconDown from "assets/svg/down-white.svg";
import Wallet from "assets/svg/wallet.svg";
import Button from "components/Button";
import HeadlessModal, {
    HeadlessModalDefaultHeader
} from "components/HeadlessModal";
import { TAILWIND_BREAKPOINT } from "const/mediaQueries";
import { useDappContext } from "context/dapp";
import { useWallet } from "context/wallet";
import useLogout from "hooks/useLogout";
import useMediaQuery from "hooks/useMediaQuery";
import useMounted from "hooks/useMounted";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import styles from "./AddressMenu.module.css";
function AddressMenu() {
    const { loggedIn, address } = useDappContext();
    const logoutDapp = useLogout();
    const [mShowMenu, setMShowMenu] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const mounted = useMounted();
    const isSMScreen = useMediaQuery(
        `(max-width: ${TAILWIND_BREAKPOINT.SM}px)`
    );
    const { connectWallet } = useWallet();
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
    const menu = (
        <Menu className={styles.addressMenu}>
            <Menu.Item
                key="1"
                className={styles.addressMenuItem}
                icon={<IconCopy className="text-ash-gray-500" />}
                onClick={copyAddress}
            >
                Copy address
            </Menu.Item>
            <Menu.Item
                key="2"
                className={styles.addressMenuItem}
                icon={<IconChange />}
            >
                Change wallet
            </Menu.Item>
            <Menu.Item
                key="3"
                className={styles.addressMenuItem}
                icon={<IconDisconnect />}
                onClick={() => logoutDapp({})}
            >
                Disconnect wallet
            </Menu.Item>
        </Menu>
    );

    const DropdownBtn = () => (
        <AntdButton
            icon={<Image src={Avatar} width={24} height={24} alt="avatar" />}
            style={{ width: 160 }}
            className={styles.connect}
            onClick={() => isSMScreen && setMShowMenu(true)}
        >
            <span className={styles.address}>
                {address.slice(0, 4) +
                    "..." +
                    address.slice(address.length - 4)}
            </span>
            <span>
                <IconDown />
            </span>
        </AntdButton>
    );
    return (
        <>
            <div>
                {mounted &&
                    (loggedIn ? (
                        <Dropdown
                            overlay={menu}
                            trigger={["click"]}
                            disabled={isSMScreen}
                            visible={showMenu}
                            onVisibleChange={() => setShowMenu(state => !state)}
                        >
                            <div>
                                <DropdownBtn />
                            </div>
                        </Dropdown>
                    ) : (
                        <>
                            <Button
                                leftIcon={!isSMScreen ? <Wallet /> : undefined}
                                bottomRightCorner
                                onClick={() => connectWallet()}
                                glowOnHover
                                className="text-xs"
                            >
                                Connect wallet
                            </Button>
                        </>
                    ))}
            </div>
            {isSMScreen && (
                <HeadlessModal
                    open={mShowMenu}
                    onClose={() => setMShowMenu(false)}
                    transition="btt"
                >
                    <div className="clip-corner-4 clip-corner-tl bg-ash-dark-600 p-4 fixed bottom-0 inset-x-0 text-white">
                        <HeadlessModalDefaultHeader
                            onClose={() => setMShowMenu(false)}
                        />
                        <div className="mt-1 px-6 pb-4">
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
                    </div>
                </HeadlessModal>
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
        </>
    );
}

export default AddressMenu;
