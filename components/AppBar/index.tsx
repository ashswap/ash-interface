import Image from "next/image";
import Link from "next/link";
import Button from "components/Button";
import Nav from "components/Nav";
import Wallet from "assets/svg/wallet.svg";
import { useWallet } from "context/wallet";
import IconDown from "assets/svg/down-white.svg";
import IconCopy from "assets/svg/copy.svg";
import IconChange from "assets/svg/change.svg";
import IconDisconnect from "assets/svg/disconnect.svg";
import Avatar from "assets/images/avatar.png";
import { Dropdown, Menu, Button as AntdButton } from "antd";
import styles from "./AppBar.module.css";

const AppBar = () => {
    const { provider, connectExtension } = useWallet();

    const menu = (
        <Menu className={styles.addressMenu}>
            <Menu.Item
                key="1"
                className={styles.addressMenuItem}
                icon={<IconCopy />}
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
            >
                Disconnect wallet
            </Menu.Item>
        </Menu>
    );

    return (
        <div className="flex justify-between items-center px-12 py-5">
            <Link href="/" passHref>
                <div>
                    <Image
                        src="/logo.png"
                        alt="Ashswap logo"
                        height={54}
                        width={124}
                    />
                </div>
            </Link>
            <Nav />

            {provider && provider?.account ? (
                <Dropdown overlay={menu} className={styles.connect}>
                    <AntdButton
                        icon={
                            <Image
                                src={Avatar}
                                width={24}
                                height={24}
                                alt="avatar"
                            />
                        }
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
                </Dropdown>
            ) : (
                <Button
                    leftIcon={<Wallet />}
                    bottomRightCorner
                    onClick={connectExtension}
                >
                    Connect wallet
                </Button>
            )}
        </div>
    );
};

export default AppBar;
