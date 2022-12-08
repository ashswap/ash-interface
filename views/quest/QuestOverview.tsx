import { logout } from "@elrondnetwork/dapp-core/utils";
import ICCaretRight from "assets/svg/caret-right.svg";
import { atomQuestUserStats } from "atoms/ashpoint";
import { accAddressState } from "atoms/dappState";
import GlowingButton from "components/GlowingButton";
import { ENVIRONMENT } from "const/env";
import { initGeetest4 } from "helper/geetest";
import logApi from "helper/logHelper";
import { formatAmount } from "helper/number";
import { shortenString } from "helper/string";
import { useConnectWallet } from "hooks/useConnectWallet";
import { GeetestCaptchaObj } from "interface/geetest";
import { QuestActionType, QuestUserStatsModel } from "interface/quest";
import moment from "moment";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import QuestItem from "./QuestItem";

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
    const [userStats, setUserStats] = useRecoilState(atomQuestUserStats);
    const connectWallet = useConnectWallet();
    const userAddress = useRecoilValue(accAddressState);
    const captchaElRef = useRef(null);
    const captchaObjRef = useRef<GeetestCaptchaObj>();
    const [firstLoad, setFirstLoad] = useState(true);

    const isRegistered = useMemo(() => {
        return (
            userStats?.wallet.discord_id &&
            userStats.wallet.wallet_address === userAddress
        );
    }, [userStats, userAddress]);

    const getUserStats = useCallback(() => {
        logApi
            .get<QuestUserStatsModel>("/api/v1/wallet")
            .then((res) => setUserStats(res.data))
            .catch((err) => console.log(err))
            .finally(() => setFirstLoad(false));
    }, [setUserStats]);

    const register = useCallback(
        (captcha: string) => {
            logApi
                .post(
                    "/api/v1/wallet",
                    {
                        discord: {
                            code,
                        },
                    },
                    {
                        headers: {
                            "X-ASH-Captcha": captcha,
                        },
                    }
                )
                .catch((err) => {
                    let msg = err?.response?.data?.error || "";
                    if (err?.response?.status === 403) {
                        msg = "Something went wrong!!, please try again later";
                    }
                    setErrMsg(msg);
                })
                .finally(() => {
                    getUserStats();
                });
        },
        [code, getUserStats]
    );

    const unlinkDiscord = useCallback(() => {
        logApi
            .post("/api/v1/wallet/unlink", {
                platform: "discord",
            })
            .finally(() => getUserStats());
    }, [getUserStats]);

    useEffect(() => {
        if (userAddress) {
            getUserStats();
        } else {
            setUserStats(undefined);
        }
    }, [userAddress, setUserStats, getUserStats]);

    useEffect(() => {
        initGeetest4({ product: "bind", riskType: "slide" }, (obj) => {
            captchaObjRef.current?.destroy();
            captchaObjRef.current = obj
                .appendTo(captchaElRef.current as any)
                .onSuccess(() => {
                    const validate = obj.getValidate();
                    const captcha = Buffer.from(
                        JSON.stringify(validate)
                    ).toString("base64");
                    register(captcha);
                });
        });
    }, [register]);

    useEffect(() => {
        const query = router.query;
        const code = query.code;
        if (code) {
            setCode(code as string);
            delete query.code;
            router.replace({
                query,
            });
        }
    }, [router]);

    if (firstLoad && !userStats) return null;

    return (
        <>
            <div ref={captchaElRef}></div>
            <h1 className="text-2xl md:text-5xl font-bold text-white mb-7 md:mb-11">
                Quest
            </h1>
            <div className="lg:flex lg:space-x-2">
                <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-2 shrink-0 min-w-[20rem]">
                    <div className="p-4 bg-ash-dark-600">
                        <div className="text-lg mb-4">
                            <span className="font-semibold text-stake-gray-500">
                                {"// "}
                            </span>
                            <span className="font-bold text-white">Wallet</span>
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
                            <span className="font-bold text-white">
                                Discord
                            </span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <div className="font-semibold text-stake-gray-500">
                                {isRegistered
                                    ? userStats?.wallet.discord_metadata?.user
                                          .username
                                    : "_"}
                            </div>
                            {isRegistered && (
                                <button
                                    className="font-bold text-ash-purple-500 underline"
                                    onClick={() => unlinkDiscord()}
                                >
                                    Disconnect
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="p-4 bg-ash-dark-600 space-y-9">
                        <div>
                            <div className="mb-2">
                                <span className="font-bold text-2xl text-white">
                                    {userStats?.wallet.ash_point_total
                                        ? formatAmount(
                                              userStats?.wallet.ash_point_total,
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
                                        ? formatAmount(userStats?.wallet.rank, {
                                              isInteger: true,
                                          })
                                        : "_"}
                                </span>
                            </div>
                            <div className="text-xs">
                                <span className="font-semibold text-ash-gray-500">
                                    {"// "}
                                </span>
                                <span className="font-bold text-ash-gray-500">
                                    Your ranked
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="mb-2">
                                <span className="font-bold text-2xl text-white">
                                    {userStats?.wallet.created_at
                                        ? moment
                                              .unix(
                                                  userStats.wallet.created_at /
                                                      1000
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

                {!isRegistered ? (
                    <div className="grow flex flex-col items-center px-12 mt-10 lg:mt-0">
                        <div className="font-bold text-3xl lg:text-5xl text-stake-gray-500 leading-tight mb-16">
                            2 small steps to start!
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

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Star active={!!code} />
                                    <ICCaretRight className="w-2 h-2" />
                                </div>
                                <div className="w-14 mx-4 border-t border-t-stake-gray-500 border-dashed"></div>
                                <div className="font-bold text-4xl text-white">
                                    2
                                </div>
                                <a href={ENVIRONMENT.LOGIN_DISCORD_LINK}>
                                    <GlowingButton
                                        theme="cyan"
                                        className="w-40 h-14 ml-6 clip-corner-1 clip-corner-br font-bold text-sm "
                                    >
                                        Link your Discord
                                    </GlowingButton>
                                </a>
                            </div>
                            <div className="mt-20">
                                <GlowingButton
                                    theme="pink"
                                    className="w-full h-16 font-bold text-lg disabled:bg-ash-dark-300"
                                    disabled={!code || !userAddress}
                                    onClick={() =>
                                        captchaObjRef.current?.showBox()
                                    }
                                >
                                    Register
                                </GlowingButton>
                            </div>
                        </div>
                        {errMsg && (
                            <span className="text-center mt-4">{errMsg}</span>
                        )}
                    </div>
                ) : (
                    <div className="mt-4 lg:mt-0 grow md:min-w-[40rem] flex flex-col space-y-2">
                        {Object.entries(userStats?.action || {})
                            .sort(([k1, q1], [k2, q2]) =>
                                q2.is_claimed ? -1 : 1
                            )
                            .map(([k, q]) => (
                                <QuestItem
                                    key={k}
                                    questData={q}
                                    type={k as QuestActionType}
                                />
                            ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default QuestOverview;
