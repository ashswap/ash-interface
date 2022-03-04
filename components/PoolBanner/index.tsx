import Blur from "assets/images/blur-alt.png";
import IconClose from "assets/svg/close.svg";
import Button from "components/Button";
import IconButton from "components/IconButton";
import Image from "next/image";
import { useState } from "react";
import styles from "./PoolBanner.module.css";

const PoolBanner = () => {
    const [show, setShow] = useState<boolean>(true);

    return (
        <>
            {show && (
                <div className="relative w-full bg-transparent mr-[-3.75rem]">
                    {/* clip background visual */}
                    <div className="absolute top-0 left-0 right-0 bottom-0 z-[-1] bg-ash-dark-600 clip-corner-4 clip-corner-tl"></div>
                    <div className="absolute top-4 right-4 z-10">
                        <IconButton
                            icon={<IconClose />}
                            iconSize="small"
                            className="bg-ash-dark-700"
                            onClick={() => setShow(false)}
                        />
                    </div>
                    <div className="flex justify-between p-9 sm:pr-0 sm:p-12 lg:pl-24 lg:pt-11 lg:pb-[4.125rem] lg:pr-0">
                        <div className="sm:pt-4 md:pt-8 lg:pt-11">
                            <div className="mb-5 text-[2rem] lg:text-5xl leading-tight font-bold">
                                <div style={{ color: "white" }}>
                                    Deposit to
                                </div>
                                <div style={{ color: "#ffc10c" }}>
                                    Earn token
                                </div>
                                <div style={{ color: "#55C8EA" }}>
                                    & Farm LP
                                </div>
                            </div>
                            <div className="text-sm font-bold text-white">
                                <div>
                                    <span style={{ color: "#ffc10c" }}>
                                        Earn
                                    </span>{" "}
                                    from every completed transaction.
                                </div>
                                <div>
                                    <span style={{ color: "#55C8EA" }}>
                                        Farm
                                    </span>{" "}
                                    from liquidity mining.
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block translate-x-0 lg:translate-x-[3.75rem] relative">
                            <Image
                                src={Blur}
                                width={380}
                                height={257}
                                alt="blur"
                            />
                            <div
                                className={`${styles.blurContent} absolute top-16 right-11 w-[17rem]`}
                            >
                                <div className="flex items-center justify-between">
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
                                <div className="font-bold text-2xl mt-6 text-white">
                                <div>FARMS ARE ARRIVING</div>
                            <div>SOON!</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* TODO: binding data when available */}
            {/* <div
                className={`fixed right-0 top-56 z-10 bg-earn h-[4.625rem] md:h-[6.5rem] text-white text-xs md:text-sm flex flex-col justify-center pr-1 pl-2 md:pr-3 md:pl-3 font-bold ${show &&
                    "md:hidden"}`}
            >
                <div>196.23</div>
                <div>ELGD</div>
            </div> */}
        </>
    );
};

export default PoolBanner;
