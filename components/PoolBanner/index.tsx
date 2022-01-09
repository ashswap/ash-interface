import Blur from "assets/images/blur.png";
import Image from "next/image";
import Panel, { PanelContent } from "components/Panel";
import IconButton from "components/IconButton";
import IconClose from "assets/svg/close.svg";
import IconNext from "assets/svg/next-next.svg";
import styles from "./PoolBanner.module.css";
import Button from "components/Button";
import { useState } from "react";

const PoolBanner = () => {
    const [show, setShow] = useState<boolean>(true);

    if (!show) {
        return null;
    }

    return (
        <Panel className="h-full mb-12" dark="600">
            <PanelContent className={styles.content}>
                <div className="absolute top-0 right-0 z-40">
                    <IconButton
                        icon={<IconClose />}
                        iconSize="small"
                        className="bg-ash-dark-700"
                        onClick={() => setShow(false)}
                    />
                </div>
                <div>
                    <div className={styles.title}>
                        <div style={{ color: "white" }}>Deposit to</div>
                        <div style={{ color: "#ffc10c" }}>Earn token</div>
                        <div style={{ color: "#55C8EA" }}>& Farm LP</div>
                    </div>
                    <div className="text-sm font-bold">
                        <div>
                            <span style={{ color: "#ffc10c" }}>Earn</span> from
                            every completed transaction.
                        </div>
                        <div>
                            <span style={{ color: "#55C8EA" }}>Farm</span> from liquidity mining.
                        </div>
                    </div>
                </div>

                <div className={`${styles.blur}`}>
                    <Image src={Blur} width={426} height={257} alt="blur" />
                    <div className={styles.blurContent}>
                        <div className="flex flex-row items-center">
                            <div className="text-lg font-bold text-white opacity-70 mr-8">
                                New bounty!
                            </div>
                            <Button
                                bottomRightCorner
                                primaryColor="white"
                                textClassName="text-xs"
                            >
                                Get it!
                            </Button>
                        </div>
                        <div className={styles.blurValue}>
                            <div>FARMS ARE ARRIVING</div>
                            <div>SOON!</div>
                        </div>
                    </div>
                </div>
            </PanelContent>
        </Panel>
    );
};

export default PoolBanner;
