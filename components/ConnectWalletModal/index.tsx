import {
    useExtensionLogin,
    useWalletConnectV2Login,
    useWebWalletLogin,
} from "@multiversx/sdk-dapp/hooks";
import connectWalletBg from "assets/images/connect-wallet-bg.png";
import downloadAppGallery from "assets/images/download-app-gallery.png";
import downloadAppStore from "assets/images/download-app-store.png";
import downloadPlayStore from "assets/images/download-play-store.png";
import ICMultiversx from "assets/svg/multiversx.svg";
import ICConnectApp from "assets/svg/connect-app.svg";
import ICConnectExtension from "assets/svg/connect-extension.svg";
import ICConnectLedger from "assets/svg/connect-ledger.svg";
import ICConnectWebWallet from "assets/svg/connect-web-wallet.svg";
import {
    accAddressState,
    accIsLoggedInState,
    dappCoreState,
} from "atoms/dappState";
import { notFirstRenderConnectWallet } from "atoms/firstRenderConnectWalletState";
import { walletIsOpenConnectModalState } from "atoms/walletState";
import BaseModal from "components/BaseModal";
import Image from "components/Image";
import { useRouter } from "next/router";
import platform from "platform";
import QRCode from "qrcode";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useConnectMethod } from "hooks/useConnectMethod";
const MULTIVERSX_WALLET_LINK = {
    PLAY_STORE: "https://maiar.onelink.me/HLcx/52dcde54",
    APP_STORE: "https://maiar.onelink.me/HLcx/f0b7455c",
    APP_GALLERY: "https://maiar.onelink.me/HLcx/2e18b72b",
    CHROME_EXT:
        "https://chrome.google.com/webstore/detail/multiversx-defi-wallet/dngmlblcodfobpdpecaadgfbcggfjfnm",
};
function ConnectWalletModal() {
    const loggedIn = useRecoilValue(accIsLoggedInState);
    const accAddress = useRecoilValue(accAddressState);
    const [isOpenConnectWalletModal, setIsOpenConnectWalletModal] =
        useRecoilState(walletIsOpenConnectModalState);

    const [isOpenQR, setIsOpenQR] = useState(false);
    const [isOpenDownloadExtension, setIsOpenDownloadExtension] =
        useState(false);
    const [isOpenDownloadApp, setIsOpenDownloadApp] = useState(false);
    const [extensionLogin] = useExtensionLogin({
        callbackRoute: "",
    });
    const dappCore = useRecoilValue(dappCoreState);
    const router = useRouter();
    const [notFirstRender, setNotFirstRender] = useRecoilState(
        notFirstRenderConnectWallet
    );
    const [webWalletLogin] = useWebWalletLogin({
        callbackRoute: "",
        nativeAuth: true,
    });
    const loginMethodName = useConnectMethod();
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
    }, [loggedIn, accAddress, setIsOpenConnectWalletModal]);
    useEffect(() => {
        if (window && !loggedIn && isOpenConnectWalletModal) {
            let dataLayer = (window as any).dataLayer || [];
            dataLayer.push({
                event: "click_connect_wallet",
            });
        }
    }, [isOpenConnectWalletModal, loggedIn]);
    useEffect(() => {
        if (window && loggedIn && isOpenConnectWalletModal) {
            let dataLayer = (window as any).dataLayer || [];
            window.localStorage.setItem("address", dappCore.account.address);
            window.localStorage.setItem("method", loginMethodName);
            dataLayer.push({
                event: "success_connect_wallet",
                address: dappCore.account.address,
                method: loginMethodName,
            });
        }
    }, [
        loggedIn,
        dappCore.account.address,
        dappCore.loginInfo.loginMethod,
        isOpenConnectWalletModal,
        loginMethodName,
    ]);
    useEffect(() => {
        if (window && !loggedIn && notFirstRender) {
            let dataLayer = (window as any).dataLayer || [];
            dataLayer.push({
                event: "disconnect_wallet",
                address: window.localStorage.getItem("address"),
                method: window.localStorage.getItem("method"),
            });
        }
        if (window && !loggedIn) {
            setNotFirstRender(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedIn]);
    return (
        <>
            <BaseModal
                isOpen={isOpenConnectWalletModal}
                onRequestClose={() =>
                    setIsOpenConnectWalletModal(
                        isOpenDownloadExtension || isOpenDownloadApp
                    )
                }
                className="clip-corner-4 clip-corner-tl bg-ash-dark-400 p-4 w-[33.75rem] max-w-[100vw] text-white mx-auto flex flex-col"
            >
                <div className="flex justify-end">
                    <BaseModal.CloseBtn />
                </div>
                <div className="grow px-3 py-8 overflow-auto">
                    <div
                        className="flex justify-center bg-no-repeat bg-left bg-contain py-8 overflow-hidden"
                        style={{
                            backgroundImage: `url(${connectWalletBg.src})`,
                        }}
                    >
                        {isOpenQR ? (
                            <div>
                                <WalletConnect />
                                <div
                                    className="text-ash-purple-500 uppercase text-xs sm:text-sm text-center font-bold cursor-pointer"
                                    onClick={() => setIsOpenDownloadApp(true)}
                                >
                                    I DON’T HAVE xPortal APP
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col pb-16 overflow-hidden">
                                <div className="font-bold text-2xl mb-20 text-center">
                                    <span>Connect to </span>
                                    <span className="text-ash-blue-500">
                                        a wallet
                                    </span>
                                </div>
                                <div
                                    className="max-w-full w-[21.875rem] h-24 bg-ash-dark-600 cursor-pointer flex items-center px-6 mb-4"
                                    onClick={extensionLogin}
                                >
                                    <div className="mr-[1.625rem]">
                                        <ICConnectExtension
                                            className={`colored-drop-shadow-xs colored-drop-shadow-ash-blue-500 w-16 inline text-ash-blue-500`}
                                        />
                                    </div>
                                    <div className="text-sm font-bold uppercase">
                                        <span>MultiversX DeFi </span>
                                        <span className="text-ash-blue-500">
                                            Wallet
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="max-w-full w-[21.875rem] h-24 bg-ash-dark-600 cursor-pointer flex items-center px-6 mb-4"
                                    onClick={() => setIsOpenQR(true)}
                                >
                                    <div className="mr-[1.625rem] w-16 text-center">
                                        <ICConnectApp
                                            className={`colored-drop-shadow-xs colored-drop-shadow-ash-blue-500 h-16 inline text-ash-blue-500`}
                                        />
                                    </div>
                                    <div className="text-sm font-bold uppercase">
                                        <span>xPortal </span>
                                        <span className="text-ash-blue-500">
                                            App
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="max-w-full w-[21.875rem] h-24 bg-ash-dark-600 cursor-pointer flex items-center px-6 mb-4"
                                    onClick={() => {
                                        router.push({
                                            pathname: "/ledger",
                                            query: {
                                                callbackUrl: router.pathname,
                                            },
                                        });
                                        setIsOpenConnectWalletModal(false);
                                    }}
                                >
                                    <div className="mr-[1.625rem]">
                                        <ICConnectLedger
                                            className={`colored-drop-shadow-xs colored-drop-shadow-ash-blue-500 w-16 inline text-ash-blue-500`}
                                        />
                                    </div>
                                    <div className="text-sm font-bold uppercase">
                                        <span>Ledger </span>
                                        <span className="text-ash-blue-500">
                                            Wallet
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="max-w-full w-[21.875rem] h-24 bg-ash-dark-600 cursor-pointer flex items-center px-6 mb-4"
                                    onClick={webWalletLogin}
                                >
                                    <div className="mr-[1.625rem]">
                                        <ICConnectWebWallet
                                            className={`colored-drop-shadow-xs colored-drop-shadow-ash-blue-500 w-16 inline text-ash-blue-500`}
                                        />
                                    </div>
                                    <div className="text-sm font-bold uppercase">
                                        <span>MultiversX Web </span>
                                        <span className="text-ash-blue-500">
                                            Wallet
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </BaseModal>
            <BaseModal
                isOpen={isOpenDownloadApp}
                onRequestClose={() => setIsOpenDownloadApp(false)}
                className="clip-corner-4 clip-corner-tl bg-ash-dark-400 p-4 text-white w-[38.75rem] max-w-[100vw] mx-auto flex flex-col"
            >
                <div className="flex justify-end">
                    <BaseModal.CloseBtn />
                </div>
                <div className="grow flex flex-col items-center text-center py-10 px-6">
                    <div className="text-lg sm:text-2xl font-bold mb-9">
                        Install{" "}
                        <span className="text-ash-blue-500">xPortal</span>{" "}
                        App
                    </div>
                    <div className="flex items-center space-x-8 mb-[5.5rem]">
                        <ICConnectApp
                            className={`colored-drop-shadow-xs colored-drop-shadow-pink-600 text-pink-600 h-14 sm:h-[6.75rem] w-auto`}
                        />
                        <div className="flex items-center space-x-1">
                            <div className="w-1.5 h-1.5 bg-pink-600"></div>
                            <div className="w-1.5 h-1.5 bg-[#FF00B8]"></div>
                            <div className="w-1.5 h-1.5 bg-[#8C1AC2]"></div>
                            <div className="w-1.5 h-1.5 bg-[#1A45C2]"></div>
                        </div>
                        <div className="relative w-9 h-9 sm:w-[4.75rem] sm:h-[4.75rem] flex items-center justify-center">
                            <div className="bg-white rounded-lg md:rounded-2xl rotate-45 absolute w-full h-full"></div>
                            <ICMultiversx className="relative w-4 h-auto sm:w-7 text-mvx-xportal"/>
                        </div>
                    </div>
                    <div className="overflow-auto max-w-full">
                        <div className="flex space-x-2 mb-7">
                            <a
                                href={MULTIVERSX_WALLET_LINK.PLAY_STORE}
                                target="_blank"
                                rel="noreferrer"
                                className="border border-white/50 relative flex items-center px-1 py-[0.125rem] cursor-pointer"
                            >
                                <div className="absolute left-[-1px] h-3 border-l border-l-ash-dark-400"></div>
                                <div className="relative w-[6.5rem] h-8 sm:h-12 sm:w-[9.75rem]">
                                    <Image
                                        src={downloadPlayStore}
                                        alt="download from play store"
                                        className="absolute inset-0 w-full h-full"
                                    />
                                </div>
                                <div className="absolute right-[-1px] h-3 border-r border-r-ash-dark-400"></div>
                            </a>
                            <a
                                href={MULTIVERSX_WALLET_LINK.APP_STORE}
                                target="_blank"
                                rel="noreferrer"
                                className="border border-white/50 relative flex items-center px-1 py-[0.125rem] cursor-pointer"
                            >
                                <div className="absolute left-[-1px] h-3 border-l border-l-ash-dark-400"></div>
                                <div className="relative w-[6.5rem] h-8 sm:h-12 sm:w-[9.75rem]">
                                    <Image
                                        src={downloadAppStore}
                                        alt="download from play store"
                                        className="absolute inset-0 w-full h-full"
                                    />
                                </div>
                                <div className="absolute right-[-1px] h-3 border-r border-r-ash-dark-400"></div>
                            </a>
                            <a
                                href={MULTIVERSX_WALLET_LINK.APP_GALLERY}
                                target="_blank"
                                rel="noreferrer"
                                className="border border-white/50 relative flex items-center px-1 py-[0.125rem] cursor-pointer"
                            >
                                <div className="absolute left-[-1px] h-3 border-l border-l-ash-dark-400"></div>
                                <div className="relative w-[6.5rem] h-8 sm:h-12 sm:w-[9.75rem]">
                                    <Image
                                        src={downloadAppGallery}
                                        alt="download from play store"
                                        className="absolute inset-0 w-full h-full"
                                    />
                                </div>
                                <div className="absolute right-[-1px] h-3 border-r border-r-ash-dark-400"></div>
                            </a>
                        </div>
                    </div>
                    <span
                        className="cursor-pointer text-ash-gray-500 text-sm uppercase font-bold"
                        onClick={() => setIsOpenDownloadApp(false)}
                    >
                        BACK TO QR SCAN
                    </span>
                </div>
            </BaseModal>
            <BaseModal
                isOpen={isOpenDownloadExtension}
                onRequestClose={() => setIsOpenDownloadExtension(false)}
                className="clip-corner-4 clip-corner-tl bg-ash-dark-400 p-4 text-white w-[38.75rem] max-w-[100vw] mx-auto flex flex-col"
            >
                <div className="flex justify-end">
                    <BaseModal.CloseBtn />
                </div>
                <div className="grow flex flex-col items-center text-center pt-6 pb-10 px-2 sm:px-6">
                    <div className="text-lg sm:text-2xl font-bold mb-9">
                        Install{" "}
                        <span className="text-ash-blue-500">MultiversX DeFi Wallet</span>{" "}
                        on your Browser
                    </div>
                    <div className="flex items-center space-x-8 mb-[5.5rem]">
                        <ICConnectExtension
                            className={`colored-drop-shadow-xs colored-drop-shadow-pink-600 text-pink-600 w-14 sm:w-[6.75rem] h-auto`}
                        />
                        <div className="flex items-center space-x-1">
                            <div className="w-1.5 h-1.5 bg-pink-600"></div>
                            <div className="w-1.5 h-1.5 bg-[#FF00B8]"></div>
                            <div className="w-1.5 h-1.5 bg-[#8C1AC2]"></div>
                            <div className="w-1.5 h-1.5 bg-[#1A45C2]"></div>
                        </div>
                        <div className="relative w-9 h-9 sm:w-[4.75rem] sm:h-[4.75rem] flex items-center justify-center">
                            <div className="bg-white rounded-lg sm:rounded-2xl rotate-45 absolute w-full h-full"></div>
                            <ICMultiversx className="relative w-4 h-auto sm:w-7 text-mvx-xportal"/>
                        </div>
                    </div>
                    <a
                        href={MULTIVERSX_WALLET_LINK.CHROME_EXT}
                        target="_blank"
                        rel="noreferrer"
                        className="border border-white/50 relative inline-flex items-center p-1 cursor-pointer mb-5 max-w-full"
                    >
                        <div className="absolute left-[-1px] h-3 border-l border-l-ash-dark-400"></div>
                        <div className="clip-corner-1 clip-corner-tl bg-ash-blue-500 uppercase font-bold text-sm h-12 flex justify-center items-center text-center w-96 max-w-full text-white px-4">
                            <span className="truncate">
                                Download MultiversX DeFi Wallet
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
                        <span className="text-white">xPortal app</span>
                    </span>
                </div>
            </BaseModal>
        </>
    );
}

const WalletConnect = ({
    callbackRoute,
    logoutRoute,
    token,
    onLogin,
    onLogout,
}: {
    callbackRoute?: string;
    logoutRoute?: string;
    token?: string;
    onLogin?: () => void;
    onLogout?: () => void;
}) => {
    const config = useMemo(() => {
        return { logoutRoute: "" };
    }, []);
    // const [
    //     initConnect,
    //     { error, isLoading, isLoggedIn, loginFailed },
    //     { uriDeepLink, walletConnectUri },
    // ] = useWalletConnectLogin({
    //     callbackRoute: "",
    //     logoutRoute: "",
    // });
    const [
        initConnect,
        { error, isLoading, isLoggedIn, loginFailed },
        {
            uriDeepLink,
            walletConnectUri,
            cancelLogin,
            removeExistingPairing,
            connectExisting,
            wcPairings,
        },
    ] = useWalletConnectV2Login(config);
    const ref = useRef(null);
    const cancelRef = useRef(cancelLogin);
    const [qrSvg, setQrSvg] = useState<string>("");

    const isMobile =
        platform?.os?.family === "iOS" || platform?.os?.family === "Android";

    const svgQr: any = useMemo(() => {
        return {
            dangerouslySetInnerHTML: {
                __html: qrSvg,
            },
            style: {
                width: "157px",
                height: "157px",
            },
        };
    }, [qrSvg]);

    const buildQrCode = useCallback(() => {
        (async () => {
            if (walletConnectUri && ref.current !== null) {
                const svg = await QRCode.toString(walletConnectUri, {
                    type: "svg",
                });
                setQrSvg(svg);
            }
        })();
    }, [walletConnectUri]);

    const clearPairings = useCallback(async () => {
        await Promise.all(wcPairings?.map(async pair => {
            await removeExistingPairing(pair.topic);
        }) || []);
    }, [removeExistingPairing, wcPairings]);
    useEffect(() => {
        if (!walletConnectUri) {
            initConnect();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletConnectUri]);
    useEffect(() => {
        buildQrCode();
    }, [buildQrCode]);
    useEffect(() => {cancelRef.current = cancelLogin}, [cancelLogin]);
    useEffect(() => {
        return () => {
            cancelRef.current();
        };
    }, []);

    return (
        <div className="text-white flex flex-col items-center" ref={ref}>
            <div className="text-lg sm:text-2xl text-center font-bold mb-16">
                <span className="text-ash-blue-500">xPortal </span>
                <span>login</span>
            </div>
            <div className="mx-auto mb-[2.125rem] w-48 h-48 flex justify-center items-center">
                {walletConnectUri ? (
                    <div {...svgQr} />
                ) : (
                    <div className="w-10 h-10 rounded-full border-t-transparent border-pink-600 border-4 animate-spin"></div>
                )}
            </div>
            <div className="text-center mb-11 uppercase text-sm sm:text-lg font-bold">
                <div>scan this qr by</div>
                <div>your xPortal app to continue</div>
            </div>
            {isMobile && (
                <>
                    <a
                        href={uriDeepLink || ""}
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
