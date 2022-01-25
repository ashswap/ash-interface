import { WalletConnectProvider } from "@elrondnetwork/erdjs/out";
import ReactModal from "components/ReactModal";
import { useDappContext, useDappDispatch } from "context/dapp";
import { useWallet } from "context/wallet";
import storage from "helper/storage";
import { useExtensionLogin } from "hooks/useExtension";
import useInitWalletConnect from "hooks/useInitWalletConnect";
import Image from "next/image";
import platform from "platform";
import QRCode from "qrcode";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import connectWalletBg from "../../assets/images/connect-wallet-bg.png";
import downloadAppGallery from "../../assets/images/download-app-gallery.png";
import downloadAppStore from "../../assets/images/download-app-store.png";
import downloadPlayStore from "../../assets/images/download-play-store.png";
import maiarLogo from "../../assets/images/maiar-logo.png";
import ICConnectApp from "../../assets/svg/connect-app.svg";
import ICConnectExtension from "../../assets/svg/connect-extension.svg";
import styles from "./ConnectWalletModal.module.css";

const MAIAR_WALLET_LINK = {
    PLAY_STORE: "https://maiar.onelink.me/HLcx/52dcde54",
    APP_STORE: "https://maiar.onelink.me/HLcx/f0b7455c",
    APP_GALLERY: "https://maiar.onelink.me/HLcx/2e18b72b",
    CHROME_EXT:
        "https://chrome.google.com/webstore/detail/maiar-defi-wallet/dngmlblcodfobpdpecaadgfbcggfjfnm"
};

function ConnectWalletModal() {
    const { loggedIn } = useDappContext();
    const {
        isOpenConnectWalletModal,
        setIsOpenConnectWalletModal
    } = useWallet();
    const [isOpenQR, setIsOpenQR] = useState(false);
    const [isOpenDownloadExtension, setIsOpenDownloadExtension] = useState(
        false
    );
    const [isOpenDownloadApp, setIsOpenDownloadApp] = useState(false);
    const onLogin = useCallback(() => {
        setIsOpenConnectWalletModal(false);
    }, [setIsOpenConnectWalletModal]);
    const onConnectExtInit = useCallback((success: boolean) => {
        if (!success) {
            // not found extension instance -> open download extension modal
            setIsOpenDownloadExtension(true);
        }
    }, []);
    const extensionLogin = useExtensionLogin({
        onLogin,
        onInit: onConnectExtInit
    });
    useEffect(() => {
        if (!isOpenConnectWalletModal) {
            setIsOpenQR(false);
        }
    }, [isOpenConnectWalletModal]);
    useEffect(() => {
        if (loggedIn) {
            setIsOpenConnectWalletModal(false);
            setIsOpenQR(false);
            setIsOpenDownloadApp(false);
            setIsOpenDownloadExtension(false);
        }
    }, [loggedIn, setIsOpenConnectWalletModal]);
    return (
        <>
            <ReactModal
                isOpen={isOpenConnectWalletModal}
                onRequestClose={() => setIsOpenConnectWalletModal(false)}
                useClipCorner={true}
            >
                <div className="clip-corner-4 clip-corner-tl bg-ash-dark-400 py-12 px-7 w-[33.75rem] max-w-[100vw] text-white transition-none">
                    <div
                        className="flex justify-center bg-no-repeat bg-left bg-contain py-8 overflow-hidden"
                        style={{
                            backgroundImage: `url(${connectWalletBg.src})`
                        }}
                    >
                        {isOpenQR ? (
                            <div>
                                <WalletConnect />
                                <div
                                    className="text-ash-purple-500 uppercase text-xs sm:text-sm text-center font-bold cursor-pointer"
                                    onClick={() => setIsOpenDownloadApp(true)}
                                >
                                    I DON’T HAVE MAIAR MOBILE APP
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col pb-16 overflow-hidden">
                                <div className="font-bold text-2xl mb-20 text-center">
                                    <span>Connect to </span>
                                    <span className="text-ash-blue-500">
                                        Maiar Wallet
                                    </span>
                                </div>
                                <div
                                    className="max-w-full w-[21.875rem] h-24 bg-ash-dark-600 cursor-pointer flex items-center px-6 mb-4"
                                    onClick={extensionLogin}
                                >
                                    <div className="mr-[1.625rem]">
                                        <ICConnectExtension
                                            className={`${styles.connectIcon} w-16 inline text-ash-blue-500`}
                                        />
                                    </div>
                                    <div className="text-sm font-bold uppercase">
                                        <span>Maiar </span>
                                        <span className="text-ash-blue-500">
                                            web extension
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="max-w-full w-[21.875rem] h-24 bg-ash-dark-600 cursor-pointer flex items-center px-6"
                                    onClick={() => setIsOpenQR(true)}
                                >
                                    <div className="mr-[1.625rem] w-16 text-center">
                                        <ICConnectApp
                                            className={`${styles.connectIcon} h-16 inline text-ash-blue-500`}
                                        />
                                    </div>
                                    <div className="text-sm font-bold uppercase">
                                        <span>Maiar </span>
                                        <span className="text-ash-blue-500">
                                            mobile app
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </ReactModal>
            <ReactModal
                isOpen={isOpenDownloadApp}
                onRequestClose={() => setIsOpenDownloadApp(false)}
                useClipCorner={true}
            >
                <div className="clip-corner-4 clip-corner-tl bg-ash-dark-400 pt-20 pb-14 px-10 text-white w-[38.75rem] max-w-[100vw]">
                    <div className="flex flex-col items-center text-center">
                        <div className="text-lg sm:text-2xl font-bold mb-9">
                            Install{" "}
                            <span className="text-ash-blue-500">
                                Maiar Wallet
                            </span>{" "}
                            App
                        </div>
                        <div className="flex items-center space-x-8 mb-[5.5rem]">
                            <ICConnectApp
                                className={`${styles.dropShadowPink} text-pink-600 h-14 sm:h-[6.75rem] w-auto`}
                            />
                            <div className="flex items-center space-x-1">
                                <div className="w-1.5 h-1.5 bg-pink-600"></div>
                                <div className="w-1.5 h-1.5 bg-[#FF00B8]"></div>
                                <div className="w-1.5 h-1.5 bg-[#8C1AC2]"></div>
                                <div className="w-1.5 h-1.5 bg-[#1A45C2]"></div>
                            </div>
                            <div className="relative w-9 h-9 sm:w-[4.75rem] sm:h-[4.75rem] flex items-center justify-center">
                                <div className="bg-white rounded-lg md:rounded-2xl rotate-45 absolute w-full h-full"></div>
                                <div className="w-4 h-4 sm:w-7 sm:h-7 relative">
                                    <Image
                                        src={maiarLogo}
                                        alt="maiar logo"
                                        layout="fill"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-2 mb-7">
                            <a
                                href={MAIAR_WALLET_LINK.PLAY_STORE}
                                target="_blank"
                                rel="noreferrer"
                                className="border border-white/50 relative flex items-center px-1 py-[0.125rem] cursor-pointer"
                            >
                                <div className="absolute left-[-1px] h-3 border-l border-l-ash-dark-400"></div>
                                <div className="relative w-[6.5rem] h-8 sm:h-12 sm:w-[9.75rem]">
                                    <Image
                                        src={downloadPlayStore}
                                        alt="download from play store"
                                        layout="fill"
                                    />
                                </div>
                                <div className="absolute right-[-1px] h-3 border-r border-r-ash-dark-400"></div>
                            </a>
                            <a
                                href={MAIAR_WALLET_LINK.APP_STORE}
                                target="_blank"
                                rel="noreferrer"
                                className="border border-white/50 relative flex items-center px-1 py-[0.125rem] cursor-pointer"
                            >
                                <div className="absolute left-[-1px] h-3 border-l border-l-ash-dark-400"></div>
                                <div className="relative w-[6.5rem] h-8 sm:h-12 sm:w-[9.75rem]">
                                    <Image
                                        src={downloadAppStore}
                                        alt="download from play store"
                                        layout="fill"
                                    />
                                </div>
                                <div className="absolute right-[-1px] h-3 border-r border-r-ash-dark-400"></div>
                            </a>
                            <a
                                href={MAIAR_WALLET_LINK.APP_GALLERY}
                                target="_blank"
                                rel="noreferrer"
                                className="border border-white/50 relative flex items-center px-1 py-[0.125rem] cursor-pointer"
                            >
                                <div className="absolute left-[-1px] h-3 border-l border-l-ash-dark-400"></div>
                                <div className="relative w-[6.5rem] h-8 sm:h-12 sm:w-[9.75rem]">
                                    <Image
                                        src={downloadAppGallery}
                                        alt="download from play store"
                                        layout="fill"
                                    />
                                </div>
                                <div className="absolute right-[-1px] h-3 border-r border-r-ash-dark-400"></div>
                            </a>
                        </div>
                        <span
                            className="cursor-pointer text-ash-gray-500 text-sm uppercase font-bold"
                            onClick={() => setIsOpenDownloadApp(false)}
                        >
                            BACK TO QR SCAN
                        </span>
                    </div>
                </div>
            </ReactModal>
            <ReactModal
                isOpen={isOpenDownloadExtension}
                onRequestClose={() => setIsOpenDownloadExtension(false)}
                useClipCorner={true}
            >
                <div className="clip-corner-4 clip-corner-tl bg-ash-dark-400 pt-20 pb-14 px-6 sm:px-10 text-white w-[38.75rem] max-w-[100vw]">
                    <div className="flex flex-col items-center text-center overflow-hidden">
                        <div className="text-lg sm:text-2xl font-bold mb-9">
                            Install{" "}
                            <span className="text-ash-blue-500">
                                Maiar Wallet
                            </span>{" "}
                            on your Brower
                        </div>
                        <div className="flex items-center space-x-8 mb-[5.5rem]">
                            <ICConnectExtension
                                className={`${styles.dropShadowPink} text-pink-600 w-14 sm:w-[6.75rem] h-auto`}
                            />
                            <div className="flex items-center space-x-1">
                                <div className="w-1.5 h-1.5 bg-pink-600"></div>
                                <div className="w-1.5 h-1.5 bg-[#FF00B8]"></div>
                                <div className="w-1.5 h-1.5 bg-[#8C1AC2]"></div>
                                <div className="w-1.5 h-1.5 bg-[#1A45C2]"></div>
                            </div>
                            <div className="relative w-9 h-9 sm:w-[4.75rem] sm:h-[4.75rem] flex items-center justify-center">
                                <div className="bg-white rounded-lg sm:rounded-2xl rotate-45 absolute w-full h-full"></div>
                                <div className="w-4 h-4 sm:w-7 sm:h-7 relative">
                                    <Image
                                        src={maiarLogo}
                                        alt="maiar logo"
                                        layout="fill"
                                    />
                                </div>
                            </div>
                        </div>
                        <a
                            href={MAIAR_WALLET_LINK.CHROME_EXT}
                            target="_blank"
                            rel="noreferrer"
                            className="border border-white/50 relative inline-flex items-center p-1 cursor-pointer mb-5 max-w-full"
                        >
                            <div className="absolute left-[-1px] h-3 border-l border-l-ash-dark-400"></div>
                            <div className="clip-corner-1 clip-corner-tl bg-ash-blue-500 uppercase font-bold text-sm h-12 flex justify-center items-center text-center w-96 max-w-full text-white px-4">
                                <span className="truncate">
                                    Download maiar extension
                                </span>
                            </div>
                            <div className="absolute right-[-1px] h-3 border-r border-r-ash-dark-400"></div>
                        </a>
                        <span
                            className="cursor-pointer text-ash-gray-500 text-xs sm:text-sm uppercase font-bold"
                            onClick={() => {
                                setIsOpenDownloadExtension(false);
                                setIsOpenQR(true);
                            }}
                        >
                            <span>Or, use </span>
                            <span className="text-white">maiar mobile app</span>
                        </span>
                    </div>
                </div>
            </ReactModal>
        </>
    );
}

const WalletConnect = ({
    callbackRoute,
    logoutRoute,
    token,
    onLogin,
    onLogout
}: {
    callbackRoute?: string;
    logoutRoute?: string;
    token?: string;
    onLogin?: () => void;
    onLogout?: () => void;
}) => {
    const { walletConnectDeepLink } = useDappContext();
    const dispatch = useDappDispatch();

    const ref = useRef(null);
    const [qrSvg, setQrSvg] = useState<string>("");
    const [wcUri, setWcUri] = useState<string>("");
    const { error, walletConnectInit, walletConnect } = useInitWalletConnect({
        callbackRoute,
        logoutRoute,
        onLogin,
        onLogout
    });
    const walletConnectLogin = useCallback(
        (walletConnect: WalletConnectProvider) => {
            walletConnect.login().then(walletConectUri => {
                if (token) {
                    setWcUri(`${walletConectUri}&token=${token}`);
                    dispatch({
                        type: "setTokenLogin",
                        tokenLogin: {
                            loginToken: token
                        }
                    });
                } else {
                    setWcUri(walletConectUri);
                }
            });
        },
        [dispatch, token]
    );

    // only init walletConnect once
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(walletConnectInit, []);

    useEffect(() => {
        if (walletConnect) {
            storage.local.removeItem("walletconnect");
            walletConnectLogin(walletConnect);
            if (
                "walletConnector" in walletConnect &&
                walletConnect.walletConnector
            ) {
                walletConnect.walletConnector.on("disconnect", () => {
                    if (ref.current !== null) {
                        walletConnectLogin(walletConnect);
                    }
                });
            }
        }
    }, [walletConnect, token, ref, walletConnectLogin]);

    const isMobile =
        platform?.os?.family === "iOS" || platform?.os?.family === "Android";

    const svgQr: any = useMemo(() => {
        return {
            dangerouslySetInnerHTML: {
                __html: qrSvg
            },
            style: {
                width: "157px",
                height: "157px"
            }
        };
    }, [qrSvg]);

    const buildQrCode = useCallback(() => {
        (async () => {
            if (wcUri && ref.current !== null) {
                const svg = await QRCode.toString(wcUri, {
                    type: "svg"
                });
                setQrSvg(svg);
            }
        })();
    }, [wcUri]);

    useEffect(buildQrCode, [buildQrCode]);

    return (
        <div className="text-white flex flex-col items-center" ref={ref}>
            <div className="text-lg sm:text-2xl text-center font-bold mb-16">
                <span className="text-ash-blue-500">Maiar mobile </span>
                <span>login</span>
            </div>
            <div className="mx-auto mb-[2.125rem]" {...svgQr} />
            <div className="text-center mb-11 uppercase text-sm sm:text-lg font-bold">
                <div>scan this qr by</div>
                <div>your maiar mobile app to continue</div>
            </div>
            {isMobile && (
                <>
                    <a
                        href={`${walletConnectDeepLink}?wallet-connect=${encodeURIComponent(
                            wcUri
                        )}`}
                        rel="noopener noreferrer nofollow"
                        target="_blank"
                        className="border border-white/50 relative inline-flex items-center p-1 cursor-pointer mb-5 max-w-full"
                    >
                        <div className="absolute left-[-1px] h-3 border-l border-l-ash-dark-400"></div>
                        <div className="clip-corner-1 clip-corner-tl bg-ash-blue-500 uppercase font-bold text-sm h-12 flex justify-center items-center text-center text-white px-4">
                            <span className="truncate">Connect Wallet</span>
                        </div>
                        <div className="absolute right-[-1px] h-3 border-r border-r-ash-dark-400"></div>
                    </a>
                </>
            )}
        </div>
    );
};

export default ConnectWalletModal;
