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
                        <div style={{ color: "white" }}>Deposite to</div>
                        <div style={{ color: "#ffc10c" }}>Earn token</div>
                        <div style={{ color: "#55C8EA" }}>& Farm LP</div>
                    </div>
                    <div className="text-sm font-bold">
                        <div>
                            <span style={{ color: "#ffc10c" }}>Earn</span> from
                            every completed transaction.
                        </div>
                        <div>
                            <span style={{ color: "#55C8EA" }}>Farm</span> is
                            everyday bounty!
                        </div>
                    </div>
                </div>

                <div className={`${styles.blur}`}>
                    <Image src={Blur} width={426} height={257} alt="blur" />
                    <div className={styles.blurContent}>
                        <div className="flex flex-row">
                            <div className="text-lg font-bold text-white opacity-70 mr-8">
                                Your total bounty
                            </div>
                            <Button
                                bottomRightCorner
                                primaryColor="white"
                                textClassName="text-xs"
                            >
                                Harvest
                            </Button>
                        </div>
                        <div className={styles.blurValue}>
                            <span>00.00 ELGD</span>
                        </div>
                    </div>
                    <Button
                        leftIcon={<IconNext />}
                        bottomRightCorner
                        primaryColor="dark-700"
                        style={{ height: 64, marginLeft: 75 }}
                        className="z-50"
                        textClassName="text-xs"
                    >
                        Your joined pools
                    </Button>
                </div>
            </PanelContent>
        </Panel>
    );
};

export default PoolBanner;
