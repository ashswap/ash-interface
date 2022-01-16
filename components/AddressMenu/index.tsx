import { Button as AntdButton, Dropdown, Menu } from "antd";
import Avatar from "assets/images/avatar.png";
import IconChange from "assets/svg/change.svg";
import IconCopy from "assets/svg/copy.svg";
import IconDisconnect from "assets/svg/disconnect.svg";
import IconDown from "assets/svg/down-white.svg";
import Wallet from "assets/svg/wallet.svg";
import Button from "components/Button";
import Modal from "components/ReactModal";
import { TAILWIND_BREAKPOINT } from "const/mediaQueries";
import { useWallet } from "context/wallet";
import useMediaQuery from "hooks/useMediaQuery";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import styles from "./AddressMenu.module.css";
function AddressMenu() {
    const { provider, connectExtension, disconnectExtension } = useWallet();
    const [mShowMenu, setMShowMenu] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const isSMScreen = useMediaQuery(
        `(max-width: ${TAILWIND_BREAKPOINT.SM}px)`
    );
    useEffect(() => {
        setMShowMenu(false);
        setShowMenu(false);
    }, [isSMScreen]);
    const copyAddress = useCallback(() => {
        if (!provider) {
            return;
        }
        setMShowMenu(false);
        setShowMenu(false);
        navigator.clipboard.writeText(provider.account.address);
    }, [provider]);
    const menu = (
        <Menu className={styles.addressMenu}>
            <Menu.Item
                key="1"
                className={styles.addressMenuItem}
                icon={<IconCopy />}
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
                onClick={disconnectExtension}
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
                {provider?.account.address.slice(0, 4) +
                    "..." +
                    provider?.account.address.slice(
                        provider?.account.address.length - 4
                    )}
            </span>
            <span>
                <IconDown />
            </span>
        </AntdButton>
    );
    return (
        <>
            <div>
                {provider && provider?.account ? (
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
                    <Button
                        leftIcon={!isSMScreen ? <Wallet /> : undefined}
                        bottomRightCorner
                        onClick={connectExtension}
                        glowOnHover
                        className="text-xs"
                    >
                        Connect wallet
                    </Button>
                )}
            </div>
            {isSMScreen && (
                <Modal
                    isOpen={mShowMenu}
                    onRequestClose={() => setMShowMenu(false)}
                    className="fixed bottom-0 left-0 right-0"
                >
                    <div className="text-white py-11 px-6">
                        <div className="text-lg font-bold mb-7">
                            Wallet actions
                        </div>
                        <div className="text-sm">
                            <button
                                className="bg-bg rounded-lg px-11 h-14 flex items-center w-full mt-4"
                                onClick={copyAddress}
                            >
                                <i className="mr-4">
                                    <IconCopy className="h-7 w-7" />
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
                                    disconnectExtension();
                                }}
                            >
                                <i className="mr-4">
                                    <IconDisconnect className="h-7 w-7" />
                                </i>
                                <span>Disconnect wallet</span>
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}

export default AddressMenu;
