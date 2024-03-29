import { logout } from "@multiversx/sdk-dapp/utils";
import ImgDiscord from "assets/images/discord.png";
import ImgAshPerpBoPBanner from "assets/images/ashperp-bop.jpg";
import ImgTwitter from "assets/images/twitter.png";
import ICBambooShootSolid from "assets/svg/bamboo-shoot-solid.svg";
import ICCaretRight from "assets/svg/caret-right.svg";
import ICELetter from "assets/svg/e-letter.svg";
import {
    atomQuestUserStats,
    questIsOpenOwnerSignModalAtom,
    questIsRegisteredAtom,
    questOwnerSignatureSelector,
} from "atoms/ashpoint";
import { accAddressState } from "atoms/dappState";
import BaseModal from "components/BaseModal";
import CopyBtn from "components/CopyBtn";
import GlowingButton from "components/GlowingButton";
import Image from "components/Image";
import { ENVIRONMENT } from "const/env";
import buildUrlParams from "helper/buildUrlParams";
import { initGeetest4 } from "helper/geetest";
import logApi from "helper/logHelper";
import { formatAmount } from "helper/number";
import storage from "helper/storage";
import { shortenString } from "helper/string";
import { useConnectWallet } from "hooks/useConnectWallet";
import usePrevState from "hooks/usePrevState";
import { useScreenSize } from "hooks/useScreenSize";
import { GeetestCaptchaObj } from "interface/geetest";
import { QuestUserStatsModel } from "interface/quest";
import moment from "moment";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import DailyQuests from "./DailyQuests";
import EventQuests from "./EventQuests";
import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import emitter from "helper/emitter";
import useSWR from "swr";

type PlatformType = "twitter" | "discord";
const Star = ({ active = false }: { active?: boolean }) => {
    return (
        <div
            className={`m-0.5 border w-5 h-5 flex items-center justify-center rotate-45 bg-transparent ${
                active ? "border-stake-green-500" : "border-stake-gray-500"
            }`}
            style={{
                boxShadow: active
                    ? "0px 4px 20px rgba(0, 255, 117, 0.5), 0px 4px 4px rgba(0, 0, 0, 0.25)"
                    : "",
            }}
        >
            <div
                className={`group-hover:scale-[2] transition-all w-2.5 h-2.5 flex items-center justify-center ${
                    active ? "bg-stake-green-500" : "bg-stake-gray-500"
                }`}
            ></div>
        </div>
    );
};
const QuestOverview = () => {
    const router = useRouter();
    const [code, setCode] = useState<string>();
    const [errMsg, setErrMsg] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [isError, setIsError] = useState(false);
    const [userStats, setUserStats] = useRecoilState(atomQuestUserStats);
    const connectWallet = useConnectWallet();
    const userAddress = useRecoilValue(accAddressState);
    const prevAddr = usePrevState(userAddress);
    const captchaElRef = useRef(null);
    const captchaObjRef = useRef<GeetestCaptchaObj>();
    const [isOpenPlatformModal, setIsOpenPlatformModal] = useState(false);
    const [questType, setQuestType] = useState<"daily" | "event">("daily");
    const screenSize = useScreenSize();
    const [isRegistered, setIsRegistered] = useRecoilState(
        questIsRegisteredAtom
    );
    const { signature: ashpointSignature } = useRecoilValue(
        questOwnerSignatureSelector
    );
    const setIsOpenOwnerSignModal = useSetRecoilState(
        questIsOpenOwnerSignModalAtom
    );

    const [platform, setPlatform] = useState<PlatformType>();

    const twitterLink = useMemo(() => {
        if (typeof window === "undefined") {
            return "";
        }

        const [path, search] = ENVIRONMENT.LOGIN_TWITTER_LINK.split("?");
        const { nextUrlParams } = buildUrlParams(search, {
            state: `twitter:${userAddress}`,
            code_challenge: userAddress,
            code_challenge_method: "plain",
            redirect_uri: location?.href.split("?")[0].replace(/\/$/, "") + "/",
        });
        return `${path}?${nextUrlParams}`;
    }, [userAddress]);

    const discordLink = useMemo(() => {
        if (typeof window === "undefined") {
            return "";
        }

        const [path, search] = ENVIRONMENT.LOGIN_DISCORD_LINK.split("?");
        const { nextUrlParams } = buildUrlParams(search, {
            state: `discord:${userAddress}`,
            redirect_uri: location?.href.split("?")[0].replace(/\/$/, "") + "/",
        });
        return `${path}?${nextUrlParams}`;
    }, [userAddress]);

    const inviteLink = useMemo(() => {
        if (typeof window === "undefined") {
            return "";
        }

        const search = new URLSearchParams({
            invitationCode:
                userStats?.wallet.invitation_code ||
                storage.local.getItem("invitationCode") ||
                "",
        });
        return `${location?.href
            .split("?")[0]
            .replace(/\/$/, "")}/?${search.toString()}`;
    }, [userStats]);

    const sharableLink = useMemo(() => {
        const text = new URLSearchParams({
            // text: `I just swapped the stablecoins with low slippage, small fees, and fast transaction confirmed on the @ash_swap devnet. Use my referral link, and we'll both earn 500 ASH Points when you join: ${inviteLink}\n#ashswap #MVX #Elrond #stableswap`,
            text: `@ash_swap - the very first #DEX following the stable-swap model on the @MultiversX blockchain is ready to use at https://app.ashswap.io/\n\nUse my referral link, and we'll both earn 500 #ASH_Points:\n${inviteLink}`,
        });
        return `https://twitter.com/intent/tweet?${text.toString()}`;
    }, [inviteLink]);

    const {
        data: _data,
        mutate: getUserStats,
        isValidating,
    } = useSWR<QuestUserStatsModel>(
        userAddress && ENVIRONMENT.ENABLE_ASHPOINT ? `/api/v1/wallet` : null,
        async (url) =>
            await logApi.get<QuestUserStatsModel>(url).then((res) => res.data)
    );

    const register = useCallback(
        (captcha: string, platform: PlatformType) => {
            setIsRegistering(true);
            logApi
                .post(
                    "/api/v1/wallet",
                    {
                        [platform]: {
                            code,
                        },
                        referral:
                            storage.local.getItem("invitationCode") ||
                            undefined,
                    },
                    {
                        headers: {
                            "X-ASH-Captcha": captcha,
                        },
                    }
                )
                .then(() => setIsRegistered(true))
                .catch((err) => {
                    const msg =
                        err?.response?.data?.error ||
                        "Something went wrong!!, please try again later";
                    setErrMsg(msg);
                    setIsError(true);
                })
                .finally(() => {
                    getUserStats();
                    setIsRegistering(false);
                });
        },
        [code, getUserStats, setIsRegistered]
    );

    const unlinkSocial = useCallback(
        (platform: PlatformType) => {
            logApi
                .post("/api/v1/wallet/unlink", {
                    platform,
                })
                .then(() => {
                    setCode(undefined);
                    setIsRegistered(false);
                })
                .finally(() => getUserStats());
        },
        [getUserStats, setIsRegistered]
    );

    useEffect(() => {
        if (
            code &&
            userAddress &&
            platform &&
            (!ENVIRONMENT.ENABLE_ASHPOINT_SIGN || ashpointSignature)
        ) {
            initGeetest4({ product: "bind", riskType: "slide" }, (obj) => {
                captchaObjRef.current?.destroy();
                captchaObjRef.current = obj
                    .appendTo(captchaElRef.current as any)
                    .onSuccess(() => {
                        const validate = obj.getValidate();
                        const captcha = Buffer.from(
                            JSON.stringify(validate)
                        ).toString("base64");
                        register(captcha, platform);
                    });
                captchaObjRef.current.showBox();
            });
        }
        return () => {
            captchaObjRef.current?.destroy();
            captchaObjRef.current = undefined;
        };
    }, [code, userAddress, platform, register, ashpointSignature]);

    useEffect(() => {
        const query = router.query;
        const code = query.code;
        if (code) {
            setCode(code as string);
            setPlatform(
                (router.query.state as string).split(":")[0] as PlatformType
            );
            delete query.state;
            delete query.code;
            router.replace({
                query,
            });
        }
    }, [router]);

    useEffect(() => {
        if (!userAddress && prevAddr) {
            setIsError(false);
            setErrMsg("");
            setCode("");
        }
    }, [userAddress, prevAddr]);

    useEffect(() => {
        if (
            userStats?.wallet.discord_id ||
            userStats?.wallet.twitter_username
        ) {
            setPlatform(userStats?.wallet?.discord_id ? "discord" : "twitter");
        }
    }, [userStats]);

    useEffect(() => {
        if (router.query.invitationCode) {
            storage.local.setItem({
                key: "invitationCode",
                data: router.query.invitationCode as string,
            });
        }
    }, [router]);

    useEffect(() => {
        if (_data) {
            setUserStats(_data);
        }
    }, [_data, setUserStats]);

    return (
        <>
            <div ref={captchaElRef}></div>
            <Link href="https://bop.ashswap.io/info" target="_blank">
                <Image
                    src={ImgAshPerpBoPBanner}
                    alt="Ashswap pool v2 banner"
                    className="w-full h-auto"
                />
            </Link>
            <h1 className="mt-6 sm:mt-10 text-2xl md:text-5xl font-bold text-white mb-7 md:mb-11">
                Quest
            </h1>
            {(ENVIRONMENT.ENV === "alpha" ||
                ENVIRONMENT.NETWORK === "mainnet") && (
                <div className="mb-6 -mx-6 px-6 sm:px-0 sm:mx-0 scrollbar-hide flex space-x-2 overflow-auto">
                    <button
                        className={`shrink-0 flex items-center h-8 sm:h-12 px-6 bg-ash-dark-600 text-xs sm:text-sm font-bold ${
                            questType === "daily"
                                ? "text-pink-600"
                                : "text-stake-gray-500"
                        }`}
                        onClick={() => setQuestType("daily")}
                    >
                        <ICBambooShootSolid className="w-3 h-3 mr-2" />
                        Daily Quest
                    </button>
                    <button
                        className={`shrink-0 flex items-center h-8 sm:h-12 px-6 bg-ash-dark-600 text-xs sm:text-sm font-bold ${
                            questType === "event"
                                ? "text-pink-600"
                                : "text-stake-gray-500"
                        }`}
                        onClick={() => setQuestType("event")}
                    >
                        <ICELetter className="w-3 h-3 mr-2" />
                        Event Quest
                    </button>
                </div>
            )}

            <div className="lg:flex lg:space-x-2">
                <div className="shrink-0 min-w-[20rem]">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-2">
                        <div className="p-4 bg-ash-dark-600">
                            <div className="text-lg mb-4">
                                <span className="font-semibold text-stake-gray-500">
                                    {"// "}
                                </span>
                                <span className="font-bold text-white">
                                    Wallet
                                </span>
                            </div>
                            <div className="flex justify-between text-xs mb-4">
                                {userAddress ? (
                                    <>
                                        <div className="font-semibold text-stake-gray-500">
                                            {shortenString(userAddress)}
                                        </div>
                                        <button
                                            className="font-bold text-ash-purple-500 underline"
                                            onClick={() => logout()}
                                        >
                                            Disconnect
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-xs">
                                            <span className="font-bold text-white underline">
                                                Connect&nbsp;
                                            </span>
                                            <span className="text-stake-gray-500">
                                                your wallet
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="text-lg mb-4">
                                <span className="font-semibold text-stake-gray-500">
                                    {"// "}
                                </span>
                                <span className="font-bold text-white capitalize">
                                    {platform || "Account"}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs mb-4">
                                <div className="font-semibold text-stake-gray-500">
                                    {isRegistered
                                        ? userStats?.wallet.twitter_metadata
                                              ?.user.username ||
                                          userStats?.wallet.discord_metadata
                                              ?.user.username
                                        : "_"}
                                </div>
                                {isRegistered && platform && (
                                    <button
                                        className="font-bold text-ash-purple-500 underline"
                                        onClick={() => unlinkSocial(platform)}
                                    >
                                        Disconnect
                                    </button>
                                )}
                            </div>
                            {isRegistered && (
                                <>
                                    <div className="text-lg mb-4">
                                        <span className="font-semibold text-stake-gray-500">
                                            {"// "}
                                        </span>
                                        <span className="font-bold text-white capitalize">
                                            Invite
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <CopyBtn text={inviteLink}>
                                            <GlowingButton
                                                theme="pink"
                                                className="w-full py-3 font-bold text-sm truncate"
                                            >
                                                Copy link
                                            </GlowingButton>
                                        </CopyBtn>
                                        <a
                                            href={sharableLink}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <GlowingButton
                                                theme="cyan"
                                                className="w-full py-3 font-bold text-sm truncate"
                                            >
                                                Share
                                            </GlowingButton>
                                        </a>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="p-4 bg-ash-dark-600 space-y-9">
                            <div>
                                <div className="mb-2">
                                    <span className="font-bold text-2xl text-white">
                                        {userStats?.wallet.ash_point_total
                                            ? formatAmount(
                                                  userStats?.wallet
                                                      .ash_point_total,
                                                  { isInteger: true }
                                              )
                                            : "_"}
                                        &nbsp;
                                    </span>
                                    <span className="font-semibold text-xs text-stake-gray-500">
                                        pts
                                    </span>
                                </div>
                                <div className="text-xs">
                                    <span className="font-semibold text-ash-gray-500">
                                        {"// "}
                                    </span>
                                    <span className="font-bold text-ash-gray-500">
                                        ASH Points
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="mb-2">
                                    <span className="font-bold text-2xl text-white">
                                        #
                                        {userStats?.wallet.rank
                                            ? formatAmount(
                                                  userStats?.wallet.rank,
                                                  {
                                                      isInteger: true,
                                                  }
                                              )
                                            : "_"}
                                    </span>
                                </div>
                                <div className="text-xs">
                                    <span className="font-semibold text-ash-gray-500">
                                        {"// "}
                                    </span>
                                    <span className="font-bold text-ash-gray-500">
                                        Your rank
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="mb-2">
                                    <span className="font-bold text-2xl text-white">
                                        {userStats?.wallet.created_at
                                            ? moment
                                                  .unix(
                                                      userStats.wallet
                                                          .created_at / 1000
                                                  )
                                                  .format("Do MMM, YYYY")
                                            : "_"}
                                    </span>
                                </div>
                                <div className="text-xs">
                                    <span className="font-semibold text-ash-gray-500">
                                        {"// "}
                                    </span>
                                    <span className="font-bold text-ash-gray-500">
                                        Your 1st day
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {!isRegistered ? (
                    <div className="grow flex flex-col items-center px-12 mt-10 lg:mt-0">
                        <div className="font-bold text-3xl lg:text-5xl text-stake-gray-500 text-center leading-tight mb-16">
                            {ENVIRONMENT.ENABLE_ASHPOINT_SIGN ? 3 : 2} small
                            steps to start!
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center">
                                    <Star active={!!userAddress} />
                                    <ICCaretRight className="w-2 h-2" />
                                </div>
                                <div className="w-14 mx-4 border-t border-t-stake-gray-500 border-dashed"></div>
                                <div className="font-bold text-4xl text-white">
                                    1
                                </div>
                                <div className="w-40 ml-6">
                                    {userAddress ? (
                                        <div>
                                            {shortenString(userAddress, 6)}
                                        </div>
                                    ) : (
                                        <GlowingButton
                                            theme="pink"
                                            className="w-full h-14 clip-corner-1 clip-corner-br font-bold text-sm "
                                            onClick={connectWallet}
                                        >
                                            Connect Wallet
                                        </GlowingButton>
                                    )}
                                </div>
                            </div>
                            {ENVIRONMENT.ENABLE_ASHPOINT_SIGN && (
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center">
                                        <Star active={!!ashpointSignature} />
                                        <ICCaretRight className="w-2 h-2" />
                                    </div>
                                    <div className="w-14 mx-4 border-t border-t-stake-gray-500 border-dashed"></div>
                                    <div className="font-bold text-4xl text-white">
                                        2
                                    </div>

                                    <GlowingButton
                                        theme="pink"
                                        className="w-40 h-14 ml-6 clip-corner-1 clip-corner-br font-bold text-sm capitalize disabled:bg-ash-dark-300"
                                        disabled={
                                            !!ashpointSignature || !userAddress
                                        }
                                        onClick={() =>
                                            setIsOpenOwnerSignModal(true)
                                        }
                                    >
                                        {ashpointSignature
                                            ? "Verified"
                                            : "Verify"}
                                    </GlowingButton>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Star active={!!code} />
                                    <ICCaretRight className="w-2 h-2" />
                                </div>
                                <div className="w-14 mx-4 border-t border-t-stake-gray-500 border-dashed"></div>
                                <div className="font-bold text-4xl text-white">
                                    {ENVIRONMENT.ENABLE_ASHPOINT_SIGN ? 3 : 2}
                                </div>

                                <GlowingButton
                                    theme="cyan"
                                    className="w-40 h-14 ml-6 clip-corner-1 clip-corner-br font-bold text-sm capitalize disabled:bg-ash-dark-300"
                                    disabled={
                                        !!code ||
                                        !userAddress ||
                                        (!ashpointSignature &&
                                            ENVIRONMENT.ENABLE_ASHPOINT_SIGN)
                                    }
                                    onClick={() => setIsOpenPlatformModal(true)}
                                >
                                    {code
                                        ? "Linked " + platform
                                        : "Link your account"}
                                </GlowingButton>

                                {/* <a
                                href={ENVIRONMENT.LOGIN_DISCORD_LINK.replace(
                                    "http://localhost:3000/ashpoint",
                                    "https://378c-27-79-164-223.ngrok.io/ashpoint"
                                )}
                            >
                                <GlowingButton
                                    theme="cyan"
                                    className="w-40 h-14 ml-6 clip-corner-1 clip-corner-br font-bold text-sm disabled:bg-ash-dark-300"
                                    disabled={!!code || !userAddress}
                                >
                                    {code
                                        ? "Linked Discord"
                                        : "Link your Discord"}
                                </GlowingButton>
                            </a> */}
                            </div>
                            <div className="mt-20">
                                {isError ? (
                                    <GlowingButton
                                        theme="pink"
                                        className="w-full h-16 font-bold text-lg disabled:bg-ash-dark-300"
                                        onClick={() => {
                                            setErrMsg("");
                                            setIsError(false);
                                            setCode(undefined);
                                            setPlatform(undefined);
                                        }}
                                    >
                                        Try another account.
                                    </GlowingButton>
                                ) : (
                                    <GlowingButton
                                        theme="pink"
                                        className="w-full h-16 font-bold text-lg disabled:bg-ash-dark-300"
                                        disabled={
                                            !code ||
                                            !userAddress ||
                                            isRegistering
                                        }
                                        onClick={() =>
                                            captchaObjRef.current?.showBox()
                                        }
                                    >
                                        Register
                                    </GlowingButton>
                                )}
                            </div>
                        </div>
                        {errMsg && (
                            <span className="text-center mt-4 break-words whitespace-pre-wrap">
                                {errMsg}
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="mt-4 lg:mt-0 grow md:min-w-[40rem]">
                        <div className="w-full flex flex-col space-y-2">
                            {questType === "daily" && <DailyQuests />}
                            {questType === "event" && <EventQuests />}
                        </div>
                    </div>
                )}
            </div>

            <BaseModal
                isOpen={!!isOpenPlatformModal}
                onRequestClose={() => setIsOpenPlatformModal(false)}
                type={screenSize.msm ? "drawer_btt" : "modal"}
                className={`clip-corner-4 clip-corner-tl bg-ash-dark-600 text-white p-4 flex flex-col max-h-full sm:min-w-[30rem] max-w-4xl mx-auto`}
            >
                <div className="flex justify-end mb-2">
                    <BaseModal.CloseBtn />
                </div>
                <div className="grow overflow-auto px-8 pb-20 sm:pb-12">
                    <div className="font-bold text-lg sm:text-2xl mb-2">
                        Choose your platform
                    </div>
                    <div className="font-bold text-xs text-white mb-14">
                        Your account must have been created for at least 30
                        days.
                    </div>
                    <div className="flex justify-around">
                        <div className="flex flex-col items-center">
                            <a href={twitterLink} className="">
                                <div className="w-14 h-auto hover:colored-drop-shadow-sm hover:colored-drop-shadow-cyan-500 duration-300">
                                    <Image
                                        src={ImgTwitter}
                                        alt="twitter"
                                        className="w-full h-auto object-contain"
                                    />
                                </div>
                            </a>
                            <div className="font-bold text-sm sm:text-base mt-4">
                                Twitter
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <a href={discordLink}>
                                <div className="w-14 h-auto hover:colored-drop-shadow-sm hover:colored-drop-shadow-ash-purple-500 duration-300">
                                    <Image
                                        src={ImgDiscord}
                                        alt="discord"
                                        className="w-full h-auto object-contain"
                                    />
                                </div>
                            </a>
                            <div className="font-bold text-sm sm:text-base mt-4">
                                Discord
                            </div>
                        </div>
                    </div>
                </div>
            </BaseModal>
        </>
    );
};

export default QuestOverview;
