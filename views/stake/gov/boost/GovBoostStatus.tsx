import { useTrackTransactionStatus } from "@elrondnetwork/dapp-core/hooks";
import { TokenPayment } from "@elrondnetwork/erdjs/out";
import { Transition } from "@headlessui/react";
import ImgASHSleep from "assets/images/ash-sleep.png";
import ICChevronRight from "assets/svg/chevron-right.svg";
import ICEqualSquare from "assets/svg/equal-square.svg";
import ICHexagonDuo from "assets/svg/hexagon-duo.svg";
import { accAddressState } from "atoms/dappState";
import {
    farmOwnerTokensQuery,
    FarmRecord,
    farmRecordsState,
    FarmToken,
    farmTransferedTokensState,
} from "atoms/farmsState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import BaseButton from "components/BaseButton";
import AdvanceBoostBar from "components/BoostBar/AdvanceBoostBar";
import GlowingButton from "components/GlowingButton";
import CardTooltip from "components/Tooltip/CardTooltip";
import { ACTIVE_FARMS } from "const/farms";
import pools from "const/pool";
import { VE_ASH_DECIMALS } from "const/tokens";
import { TRANSITIONS } from "const/transitions";
import { toEGLDD } from "helper/balance";
import { ContractManager } from "helper/contracts/contractManager";
import { formatAmount } from "helper/number";
import { sendTransactions } from "helper/transactionMethods";
import {
    useFarmBoostOwnerState,
    useFarmBoostTransferState,
} from "hooks/useFarmBoostState";
import useRouteModal from "hooks/useRouteModal";
import { FarmBoostInfo } from "interface/farm";
import Image from "components/Image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";
import FarmBoostTooltip from "views/stake/farms/FarmBoostTooltip";
import BoostCalcModal from "./BoostCalcModal";
import ICArrowBarRight from "assets/svg/arrow-bar-right.svg";
import ICChevronVRight from "assets/svg/chevron-v-right.svg";
import ICCloseV from "assets/svg/close-v.svg";
const FarmRecord = ({
    farmData,
    label,
    veConsume,
    currentBoost,
    expectedBoost,
    maxBoost,
    veAvailable,
    onSelfBoostTransferedToken,
    booster,
    lpAmt,
}: {
    farmData: FarmRecord;
    label?: string;
    veConsume: BigNumber;
    currentBoost?: FarmBoostInfo;
    expectedBoost?: FarmBoostInfo;
    maxBoost?: FarmBoostInfo;
    veAvailable?: BigNumber;
    onSelfBoostTransferedToken?: () => {};
    booster: string;
    lpAmt: BigNumber;
}) => {
    const accAddress = useRecoilValue(accAddressState);
    const farm = farmData.farm;
    const pool = useMemo(() => {
        return pools.find(
            (p) => p.lpToken.identifier === farm.farming_token_id
        );
    }, [farm]);
    const isOwner = useMemo(
        () => booster === accAddress,
        [booster, accAddress]
    );
    const canBoost = useMemo(() => {
        return (
            expectedBoost &&
            currentBoost &&
            expectedBoost.boost > currentBoost.boost
        );
    }, [expectedBoost, currentBoost]);
    if (!pool) return null;
    const [token1, token2] = pool.tokens;

    return (
        <div className="grid grid-cols-[minmax(0,auto)_1fr] sm:grid-cols-[minmax(0,auto)_1fr_2fr] md:grid-cols-[minmax(0,auto)_7.5rem_minmax(9.75rem,1fr)_0.8fr_2fr] lg:grid-cols-[minmax(0,auto)_10.5rem_minmax(9.75rem,1fr)_1fr_2fr] items-center">
            <div className="relative mr-4">
                <ICHexagonDuo
                    className={`w-9 h-9 sm:w-12 sm:h-12 stroke-transparent ${
                        isOwner
                            ? "fill-ash-cyan-500 colored-drop-shadow-[0px_4px_25px] colored-drop-shadow-ash-cyan-500/25"
                            : "fill-stake-dark-500"
                    }`}
                />
                <FarmBoostTooltip
                    farmData={farmData}
                    booster={booster}
                    lpAmt={lpAmt}
                    onSelfBoostTransferedToken={onSelfBoostTransferedToken}
                >
                    <div
                        className={`absolute inset-0 flex items-center justify-center underline font-bold text-lg ${
                            isOwner
                                ? "text-ash-dark-600"
                                : "text-stake-gray-500"
                        }`}
                    >
                        {label ? label : isOwner ? "O" : "T"}
                    </div>
                </FarmBoostTooltip>
                <div className="absolute flex bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2">
                    <Avatar
                        src={token1.logoURI}
                        alt={token1.name}
                        className="w-4 h-4"
                    />
                    <Avatar
                        src={token2.logoURI}
                        alt={token2.name}
                        className="w-4 h-4 -ml-0.5"
                    />
                </div>
            </div>
            <div className="hidden sm:block text-sm text-stake-gray-500 font-bold mr-2 truncate">
                {token1.symbol}-{token2.symbol}
            </div>
            <div className="hidden md:block space-y-2">
                <div className="text-stake-gray-500 text-xs font-bold">
                    veASH
                </div>
                <div className="relative">
                    <ICArrowBarRight
                        className="w-full h-[2.625rem] text-stake-dark-500"
                        preserveAspectRatio="xMaxYMid slice"
                    />
                    <div
                        className={`text-sm text-right font-bold h-[2.625rem] pl-4 pr-8 flex items-center justify-end absolute inset-0`}
                    >
                        <span
                            className={`${
                                canBoost
                                    ? "text-ash-pink-500"
                                    : "text-ash-purple-500"
                            }`}
                        >
                            {formatAmount(
                                toEGLDD(
                                    VE_ASH_DECIMALS,
                                    BigNumber.max(veConsume, 0)
                                ).toNumber(),
                                { notation: "standard" }
                            )}
                        </span>
                        <span className="text-ash-gray-600">&nbsp;ve</span>
                    </div>
                </div>
                <div className="text-right text-xs font-medium">&nbsp;</div>
            </div>
            <div className="hidden md:flex justify-center">
                {isOwner ? (
                    canBoost ? (
                        <>
                            <ICChevronVRight className="text-stake-gray-500" />
                            <ICChevronVRight className="text-ash-pink-500" />
                        </>
                    ) : (
                        <>
                            <ICCloseV className="text-ash-purple-500 mr-1" />
                            <ICCloseV className="text-ash-purple-500" />
                        </>
                    )
                ) : (
                    <>
                        <ICChevronVRight className="text-stake-gray-500" />
                        <ICChevronVRight className="text-stake-gray-500" />
                    </>
                )}
            </div>
            <div className={`${isOwner ? "" : "mb-6"}`}>
                <AdvanceBoostBar
                    max={maxBoost?.boost}
                    value={currentBoost?.boost}
                    newVal={expectedBoost?.boost}
                    disabled={!isOwner}
                    veLine={isOwner}
                    topLabel
                    currentVe={toEGLDD(
                        VE_ASH_DECIMALS,
                        currentBoost?.veForBoost || 0
                    ).toNumber()}
                    expectedVe={toEGLDD(
                        VE_ASH_DECIMALS,
                        expectedBoost?.veForBoost || 0
                    ).toNumber()}
                    maxVe={toEGLDD(
                        VE_ASH_DECIMALS,
                        maxBoost?.veForBoost || 0
                    ).toNumber()}
                />
            </div>
        </div>
    );
};

const FarmRecordOwner = ({
    farmData,
    canBoostChange,
}: {
    farmData: FarmRecord;
    canBoostChange?: (canBoost: boolean, farmAddress: string) => void;
}) => {
    const { currentFarmBoost, expectedFarmBoost, maxFarmBoost, availableVe } =
        useFarmBoostOwnerState(farmData);
    const ownerTokens = useRecoilValue(
        farmOwnerTokensQuery(farmData.farm.farm_address)
    );
    const lpAmt = useMemo(() => {
        return ownerTokens.reduce(
            (total, t) => total.plus(t.lpAmt),
            new BigNumber(0)
        );
    }, [ownerTokens]);
    const canBoost = useMemo(() => {
        return expectedFarmBoost.boost > currentFarmBoost.boost;
    }, [expectedFarmBoost, currentFarmBoost]);
    useEffect(
        () => canBoostChange?.(canBoost, farmData.farm.farm_address),
        [canBoostChange, canBoost, farmData.farm.farm_address]
    );
    return (
        <FarmRecord
            farmData={farmData}
            veConsume={
                expectedFarmBoost.boost > currentFarmBoost.boost
                    ? expectedFarmBoost.veForBoost.minus(
                          currentFarmBoost.veForBoost
                      )
                    : new BigNumber(0)
            }
            currentBoost={currentFarmBoost}
            expectedBoost={expectedFarmBoost}
            maxBoost={maxFarmBoost}
            veAvailable={availableVe}
            lpAmt={lpAmt}
            booster={ownerTokens[0].attributes.booster}
        />
    );
};

const FarmRecordTransfer = ({
    farmToken,
    farmData,
    onBoosting,
}: {
    farmToken: FarmToken;
    farmData: FarmRecord;
    onBoosting?: (val: boolean) => void;
}) => {
    const { currentFarmBoost, selfBoost, isBoosting } =
        useFarmBoostTransferState(farmToken, farmData);

    useEffect(() => {
        onBoosting?.(!!isBoosting);
    }, [isBoosting, onBoosting]);

    return (
        <FarmRecord
            farmData={farmData}
            veConsume={new BigNumber(0)}
            currentBoost={currentFarmBoost}
            lpAmt={farmToken.lpAmt}
            booster={farmToken.attributes.booster}
            onSelfBoostTransferedToken={() => selfBoost()}
        />
    );
};
function GovBoostStatus() {
    const { encode, modalParams, showModal, onCloseModal } =
        useRouteModal("calc_boost");
    const [openCalc, setOpenCalc] = useState(false);
    const [boostId, setBoostId] = useState<string | null>(null);
    const { isPending } = useTrackTransactionStatus({
        transactionId: boostId,
    });
    const [isSelfBoostTToken, setIsBoostTToken] = useState(false);
    const [canBoostMap, setCanBoostMap] = useState<Record<string, boolean>>({});
    useEffect(() => setOpenCalc(showModal), [showModal]);
    const accAddress = useRecoilValue(accAddressState);
    const farmRecords = useRecoilValue(farmRecordsState);
    const farmTransferedTokens = useRecoilValue(farmTransferedTokensState);
    const boostOwnerFarmTokens = useRecoilCallback(
        ({ snapshot }) =>
            async () => {
                const farmRecords = await snapshot.getPromise(farmRecordsState);
                const accAddress = await snapshot.getPromise(accAddressState);
                const txsPromises = farmRecords
                    .filter(
                        (record) =>
                            !!record.stakedData &&
                            canBoostMap[record.farm.farm_address]
                    )
                    .map((record) => {
                        const ownerTokens =
                            record.stakedData?.farmTokens.filter(
                                (f) => f.attributes.booster === accAddress
                            ) || [];
                        return { ownerTokens, farm: record.farm };
                    })
                    .filter(({ ownerTokens }) => ownerTokens.length > 0)
                    .map(({ ownerTokens, farm }) =>
                        ContractManager.getFarmContract(
                            farm.farm_address
                        ).claimRewards(
                            ownerTokens.map((t) =>
                                TokenPayment.metaEsdtFromBigInteger(
                                    t.collection,
                                    t.nonce.toNumber(),
                                    t.balance
                                )
                            )
                        )
                    );
                const { sessionId, error } = await sendTransactions({
                    transactions: (
                        await Promise.all(txsPromises)
                    ).reduce((total, txs) => [...total, ...txs], []),
                    transactionsDisplayInfo: {
                        successMessage: "All farm tokens are boosted.",
                    },
                });
                setBoostId(sessionId);
            },
        [canBoostMap]
    );
    const farmRecordsWithOwnerTokens = useMemo(() => {
        return farmRecords.filter(
            (record) =>
                (
                    record.stakedData?.farmTokens.filter(
                        (t) => t.attributes.booster === accAddress
                    ) || []
                ).length > 0
        );
    }, [farmRecords, accAddress]);
    const updateCanBoostMap = useCallback(
        (canBoost: boolean, farmAddress: string) => {
            setCanBoostMap((val) => ({ ...val, [farmAddress]: canBoost }));
        },
        []
    );
    return (
        <>
            <div className="relative">
                <div className="bg-stake-dark-300 p-6 sm:px-11 sm:pb-8 sm:pt-14">
                    <div className="text-white font-bold text-lg sm:text-2xl mb-14">
                        Your boost status
                    </div>
                    {farmRecordsWithOwnerTokens.length > 0 ? (
                        <>
                            <div className="space-y-9">
                                {farmRecordsWithOwnerTokens.map((f) => (
                                    <FarmRecordOwner
                                        key={f.farm.farm_address}
                                        farmData={f}
                                        canBoostChange={updateCanBoostMap}
                                    />
                                ))}
                            </div>
                            <div className="bg-stake-dark-500 py-4 px-8 text-yellow-600 text-xs font-bold mt-12 mb-8">
                                Boosting system will automatically uses all of
                                your veASH for maximum boosting action.
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center pb-28">
                            <div className="w-36">
                                <Image
                                    src={ImgASHSleep}
                                    alt="ash sleep"
                                    layout="responsive"
                                    className="mix-blend-luminosity"
                                />
                            </div>
                            <div className="text-lg font-bold text-stake-gray-500">
                                <div>You&apos;ve not enter any farm yet</div>
                                <div>
                                    Go{" "}
                                    <Link href="/stake/farms">
                                        <a>
                                            <span className="underline text-ash-cyan-500">
                                                stake LP-Tokens
                                            </span>
                                        </a>
                                    </Link>{" "}
                                    now
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex sm:justify-end space-x-2">
                        <Link
                            href={{
                                query: {
                                    p: encode({
                                        farmAddress:
                                            ACTIVE_FARMS[0].farm_address,
                                    }),
                                },
                            }}
                            scroll={false}
                            passHref
                        >
                            <a>
                                <BaseButton className="h-12 w-12 shrink-0 sm:w-auto bg-ash-dark-400 px-1 sm:px-6 uppercase text-sm font-bold text-white">
                                    <ICEqualSquare className="text-white w-4.5 h-4.5" />
                                    <span className="hidden sm:inline ml-1">
                                        Calculator
                                    </span>
                                </BaseButton>
                            </a>
                        </Link>
                        <CardTooltip
                            disabled={
                                farmRecordsWithOwnerTokens.length > 0 &&
                                Object.values(canBoostMap).some(
                                    (canBoost) => canBoost
                                )
                            }
                            content={
                                <>
                                    The estimated yield boost may be lower than
                                    the current yield boost.
                                </>
                            }
                        >
                            <div>
                                <GlowingButton
                                    theme="pink"
                                    className="h-12 w-full px-2 sm:px-12 uppercase text-sm font-bold text-white overflow-hidden"
                                    wrapperClassName="grow sm:grow-0 overflow-hidden"
                                    disabled={
                                        farmRecordsWithOwnerTokens.length ===
                                            0 ||
                                        Object.values(canBoostMap).every(
                                            (canBoost) => !canBoost
                                        )
                                    }
                                    onClick={() => boostOwnerFarmTokens()}
                                >
                                    <span className="mr-4 truncate">
                                        Confirm new boost
                                    </span>
                                    <ICChevronRight className="w-2 h-auto" />
                                </GlowingButton>
                            </div>
                        </CardTooltip>
                    </div>
                </div>
                {farmTransferedTokens.length > 0 && (
                    <div className="bg-ash-dark-600 p-6 sm:px-11 sm:py-14">
                        <div className="space-y-9">
                            {farmRecords.map((f) =>
                                f.stakedData?.farmTokens
                                    .filter(
                                        (t) =>
                                            t.attributes.booster !== accAddress
                                    )
                                    .map((t) => (
                                        <FarmRecordTransfer
                                            key={t.tokenId}
                                            farmData={f}
                                            farmToken={t}
                                            onBoosting={(val) =>
                                                setIsBoostTToken(val)
                                            }
                                        />
                                    ))
                            )}
                        </div>
                    </div>
                )}
                <Transition
                    show={isPending || isSelfBoostTToken}
                    {...TRANSITIONS.fadeIn}
                    {...TRANSITIONS.fadeOut}
                >
                    <div className="absolute inset-0 z-modal flex items-center justify-center bg-stake-dark-400/90 backdrop-blur-[20px]">
                        <div className="w-[140px] h-[140px] rounded-full border-[20px] border-pink-600 border-t-ash-dark-600 animate-spin"></div>
                    </div>
                </Transition>
            </div>
            <BoostCalcModal
                isOpen={showModal}
                onRequestClose={() => onCloseModal()}
                farmAddress={modalParams?.farmAddress}
            />
        </>
    );
}

export default GovBoostStatus;
