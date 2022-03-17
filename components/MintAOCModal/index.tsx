import HeadlessModal, {
    HeadlessModalDefaultHeader,
} from "components/HeadlessModal";
import InputCurrency from "components/InputCurrency";
import React, { useState } from "react";
import Image from "next/image";
import ImgUsdt from "assets/images/usdt-icon.png";
import { Slider } from "antd";
import { theme } from "tailwind.config";
import Checkbox from "components/Checkbox";
import Button from "components/Button";
import { useDappContext } from "context/dapp";
import ICChevronRight from "assets/svg/chevron-right.svg";
import ICChevronDown from "assets/svg/chevron-down.svg";
import BasePopover from "components/BasePopover";
import { useScreenSize } from "hooks/useScreenSize";
type props = {
    open: boolean;
    onClose: () => void;
};
function MintAOCModal({ open, onClose }: props) {
    const [feePct, setFeePct] = useState(0);
    const [isAgree, setIsAgree] = useState(false);
    const screenSize = useScreenSize();
    const dapp = useDappContext();
    return (
        <HeadlessModal open={open} onClose={onClose} transition={screenSize.msm ? "btt" : "center"}>
            <div
                className={`clip-corner-4 clip-corner-tl bg-ash-dark-400 ash-container p-4 text-white sm:mt-[7.5rem] fixed bottom-0 inset-x-0 sm:static max-h-full flex flex-col`}
            >
                <HeadlessModalDefaultHeader onClose={onClose} />
                <div className="px-6 lg:px-20 pb-18 mt-3.5 flex-grow overflow-auto">
                    <div className="text-2xl font-bold text-stake-green-500 mb-14">
                        Start stake & mint AOC
                    </div>
                    <div className="sm:flex sm:gap-8 lg:gap-24 mb-16">
                        <div className="flex-grow">
                            <div className="sm:flex sm:space-x-4 lg:space-x-7.5 mb-12">
                                <div className="sm:w-1/2">
                                    <div className="text-stake-gray-500 text-xs md:text-sm font-bold mb-4">
                                        Select LP & Input amount
                                    </div>
                                    <div>
                                        <BasePopover
                                            className="w-full"
                                            button={() =>
                                                <button className="w-full h-18 flex items-center justify-between px-7 bg-ash-dark-600">
                                                    <div className="flex items-center">
                                                        <div>
                                                        <Image src={ImgUsdt} alt="Token icon" width={16} height={16}/>
                                                        </div>
                                                        <div className="-ml-1">
                                                        <Image src={ImgUsdt} alt="Token icon" width={16} height={16} />
                                                        </div>
                                                        <div className="text-lg font-bold text-stake-gray-500 ml-2">Select</div>
                                                    </div>
                                                    <ICChevronDown className="w-2 h-auto text-stake-gray-500"/>
                                                </button>
                                            }
                                        >
                                            {() => <div className="">content</div>}
                                        </BasePopover>
                                    </div>
                                </div>
                                <div className="sm:w-1/2">
                                    <div className="text-earn text-xs md:text-sm font-bold mb-4">
                                        Balanced:{" "}
                                        <span className="text-white">0</span>
                                    </div>
                                    <InputCurrency className="w-full h-18 px-6 bg-ash-dark-600 text-stake-gray-500 text-right outline-none" />
                                </div>
                            </div>
                            <div className="mb-12">
                                <div className="flex justify-between mb-4">
                                    <div className="text-stake-gray-500 text-sm font-bold">
                                        Mint Fee (1% of LP input)
                                    </div>
                                    <div className="text-ash-gray-500 text-sm">
                                        ~ $0.000124
                                    </div>
                                </div>
                                <div className="bg-ash-gray-500/10 h-20 pl-7 pr-[2.375rem] flex items-center justify-between">
                                    <Image
                                        src={ImgUsdt}
                                        alt="Token icon"
                                        width={29}
                                        height={29}
                                    />
                                    <div className="text-ash-gray-500 text-2xl font-bold">
                                        3.31961451234 ASH
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="text-stake-gray-500 text-sm font-bold mb-4">
                                    Mint Fee Options. You can choose % pay or
                                    even not pay
                                </div>
                                <div className="flex">
                                    <div className="w-40 h-20 flex items-center px-7 text-[2rem] font-bold text-white bg-ash-dark-600 mr-7.5">
                                        {feePct}%
                                    </div>
                                    <div className="flex-grow flex flex-col justify-between">
                                        <div>
                                            <Slider
                                                className="ash-slider ash-slider-green my-0"
                                                step={5}
                                                marks={{
                                                    0: "",
                                                    25: "",
                                                    50: "",
                                                    75: "",
                                                    100: "",
                                                }}
                                                handleStyle={{
                                                    backgroundColor:
                                                        theme.extend.colors[
                                                            "stake-green"
                                                        ][500],
                                                    borderRadius: 0,
                                                    border:
                                                        "2px solid " +
                                                        theme.extend.colors[
                                                            "stake-green"
                                                        ][500],
                                                    width: 7,
                                                    height: 7,
                                                }}
                                                min={0}
                                                max={100}
                                                value={feePct}
                                                onChange={(e) => setFeePct(e)}
                                            />
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                className="flex-1 h-10 flex items-center justify-center bg-stake-green-500/10 text-center text-stake-green-500"
                                                onClick={() => setFeePct(0)}
                                            >
                                                0%
                                            </button>
                                            <button
                                                className="flex-1 h-10 flex items-center justify-center bg-stake-green-500/10 text-center text-stake-green-500"
                                                onClick={() => setFeePct(25)}
                                            >
                                                25%
                                            </button>
                                            <button
                                                className="flex-1 h-10 flex items-center justify-center bg-stake-green-500/10 text-center text-stake-green-500"
                                                onClick={() => setFeePct(50)}
                                            >
                                                50%
                                            </button>
                                            <button
                                                className="flex-1 h-10 flex items-center justify-center bg-stake-green-500/10 text-center text-stake-green-500"
                                                onClick={() => setFeePct(75)}
                                            >
                                                75%
                                            </button>
                                            <button
                                                className="flex-1 h-10 flex items-center justify-center bg-stake-green-500/10 text-center text-stake-green-500"
                                                onClick={() => setFeePct(100)}
                                            >
                                                100%
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/3 flex-shrink-0 bg-stake-dark-400 p-10">
                            <div className="text-lg text-white font-bold mb-16">
                                Estimate Minting
                            </div>
                            <div className="mb-11">
                                <div className="text-stake-gray-500 text-xs mb-2">
                                    AOC Receive
                                </div>
                                <div className="text-white text-lg font-bold">
                                    3,5192315135 AOC
                                </div>
                            </div>
                            <div>
                                <div className="text-stake-gray-500 text-xs mb-2">
                                    Swap fee benefits
                                </div>
                                <div className="text-white text-lg font-bold mb-4">
                                    25/75
                                </div>

                                <ul className="list-disc list-inside text-xs text-stake-gray-500">
                                    <li>You’ll hưởng lợi 25% từ LP-Tokens</li>
                                    <li>
                                        AshSwap’ll hưởng lợi 75% từ LP-Tokens
                                        bạn đã stake
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="sm:flex sm:gap-8 lg:gap-24">
                        <div className="w-full mb-12 sm:mb-0 sm:flex-grow">
                            <Checkbox
                                checked={isAgree}
                                onChange={setIsAgree}
                                text={
                                    <span>
                                        I verify that I have read the{" "}
                                        <a
                                            href="https://docs.ashswap.io/guides/add-remove-liquidity"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <b className="text-white">
                                                <u>AshSwap Pools Guide</u>
                                            </b>
                                        </a>{" "}
                                        and understand the risks of providing
                                        liquidity, including impermanent loss.
                                    </span>
                                }
                            />
                        </div>
                        <div className="w-full sm:w-1/3 flex-shrink-0">
                            <div className="border-notch">
                                <button
                                    className={`clip-corner-1 clip-corner-tl transition w-full h-12 flex items-center justify-center text-sm font-bold ${
                                        dapp.account.balance === "0"
                                            ? "bg-stake-green-500 text-ash-dark-600"
                                            : "bg-ash-dark-500 text-white"
                                    }`}
                                    disabled={dapp.account.balance === "0"}
                                >
                                    {dapp.account.balance === "0" ? (
                                        "INSUFFICIENT EGLD BALANCE"
                                    ) : (
                                        <div className="flex items-center">
                                            <div className="mr-2">STAKE</div>
                                            <ICChevronRight className="w-2 h-auto" />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HeadlessModal>
    );
}

export default MintAOCModal;
