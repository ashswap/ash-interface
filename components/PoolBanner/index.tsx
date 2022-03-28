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
                <div className="bg-ash-dark-600 w-full max-w-[55.37rem] p-4">
                    <div className="flex justify-end mb-4">
                        <button
                            className="w-10 h-10 flex justify-center items-center bg-ash-dark-700"
                            onClick={() => setShow(false)}
                        >
                            <IconClose />
                        </button>
                    </div>
                    <div className="text-2xl lg:text-5xl font-bold mb-6 text-center">
                        <span className="text-white">
                            Deposit your tokens to{" "}
                        </span>
                        <span className="text-pink-600">earn</span>
                    </div>
                    <div className="text-sm lg:text-lg font-bold text-center mb-14">
                        <span className="text-pink-600">Earn</span>
                        <span> from every completed transaction.</span>
                    </div>
                </div>
            )}
        </>
    );
};

export default PoolBanner;
