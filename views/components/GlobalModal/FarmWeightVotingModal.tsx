import { Slider } from "antd";
import ICBribe from "assets/svg/bribe.svg";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICChevronRight from "assets/svg/chevron-right.svg";
import ICLock from "assets/svg/lock.svg";
import { ashswapBaseState } from "atoms/ashswap";
import { fbHasBribe, fbTotalRewardsUSD } from "atoms/farmBribeState";
import {
    fcAccountFarmSelector,
    fcFarmSelector,
    fcTypeSelector,
} from "atoms/farmControllerState";
import { govPointSelector } from "atoms/govState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import BaseModal, { BaseModalType } from "components/BaseModal";
import BasePopover from "components/BasePopover";
import GlowingButton from "components/GlowingButton";
import TextAmt from "components/TextAmt";
import CardTooltip from "components/Tooltip/CardTooltip";
import OnboardTooltip from "components/Tooltip/OnboardTooltip";
import { FARMS_MAP } from "const/farms";
import { POOLS_MAP_LP } from "const/pool";
import { VE_ASH_DECIMALS } from "const/tokens";
import { WEEK } from "const/ve";
import { GraphOptions } from "graphql/type";
import useGraphQLQueryOptions from "graphql/useQueries/useGraphQLQueryOptions";
import { formatAmount } from "helper/number";
import useVoteForFarm from "hooks/useFarmControllerContract/useVoteForFarm";
import { useOnboarding } from "hooks/useOnboarding";
import { useScreenSize } from "hooks/useScreenSize";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { theme } from "tailwind.config";

type Props = BaseModalType & {
    farmAddress?: string;
};
const queryOptions: GraphOptions = { withFC: true, withFB: true };
const FarmWeightVotingContent = ({ farmAddress: farmAddressProp }: Props) => {
    useGraphQLQueryOptions(queryOptions);
    const [farmAddress, setFarmAddress] = useState(farmAddressProp);
    const {
        voteFarmWeight,
        trackingData: { isPending },
    } = useVoteForFarm(true);
    const [onboardingDAOFarmBribe, setOnboardedDAOFarmBribe] = useOnboarding(
        "dao_farm_weight_bribe"
    );
    const ashBase = useRecoilValue(ashswapBaseState);
    const vePoint = useRecoilValue(govPointSelector);
    const totalRewardsUSD = useRecoilValue(
        fbTotalRewardsUSD(farmAddress || "")
    );
    const hasBribe = useRecoilValue(fbHasBribe(farmAddress || ""));
    const nextTime = useMemo(() => {
        return moment
            .unix(Math.floor(moment().unix() / WEEK) * WEEK + WEEK)
            .format("Do MMM, YYYY");
    }, []);
    const powerUsed = useMemo(() => {
        if (ashBase.farmController?.account) {
            return new BigNumber(
                ashBase.farmController.account.voteUserPower
            ).toNumber();
        }
        return 0;
    }, [ashBase.farmController]);

    const farmInController = useRecoilValue(fcFarmSelector(farmAddress));
    const farmTypeData = useRecoilValue(
        fcTypeSelector(farmInController?.farmType)
    );
    const accountFarm = useRecoilValue(fcAccountFarmSelector(farmAddress));
    const powerUsedForCurrentFarm = useMemo(() => {
        if (!accountFarm?.voteUserSlope?.power) return 0;
        return +accountFarm.voteUserSlope.power;
    }, [accountFarm]);

    const [weight, setWeight] = useState(0);

    const farmRelativeWeight = useMemo(() => {
        if (!farmInController) return "0";
        return farmInController.relativeWeight;
    }, [farmInController]);

    const farmWeight = useMemo(() => {
        if (!farmInController || !farmTypeData) return new BigNumber(0);
        return new BigNumber(farmInController.nextVotedPoint.bias);
    }, [farmInController, farmTypeData]);

    const estimatedNextFarmWeight = useMemo(() => {
        if (!accountFarm?.voteUserSlope) return new BigNumber(0);
        const olddt =
            accountFarm.voteUserSlope.end -
            Math.floor(moment().unix() / WEEK) * WEEK;
        const oldBias = new BigNumber(
            accountFarm.voteUserSlope.slope
        ).multipliedBy(olddt);
        return farmWeight
            .minus(oldBias)
            .plus(vePoint.bias.multipliedBy(weight).idiv(10000));
    }, [vePoint, accountFarm, farmWeight, weight]);

    const estimatedNextRelativeWeight = useMemo(() => {
        if (!ashBase.farmController || !farmInController) return 0;
        const typeWeight = ashBase.farmController.farmTypes?.find(
            (type) => type.farmType === farmInController.farmType
        );
        if (!typeWeight || typeWeight.weight === "0") return 0;
        const oldBias = new BigNumber(farmInController.votedPoint.bias);
        const nextBias = oldBias
            .minus(farmWeight)
            .plus(estimatedNextFarmWeight);
        const nextTotalWeight = new BigNumber(
            ashBase.farmController.totalWeight
        )
            .minus(oldBias.multipliedBy(typeWeight.weight))
            .plus(nextBias.multipliedBy(typeWeight.weight));
        return nextBias
            .multipliedBy(typeWeight.weight)
            .multipliedBy(100)
            .div(nextTotalWeight)
            .toNumber();
    }, [
        ashBase.farmController,
        estimatedNextFarmWeight,
        farmInController,
        farmWeight,
    ]);

    const pool = useMemo(() => {
        if (!farmAddress) return undefined;
        const lp = FARMS_MAP[farmAddress].farming_token_id;
        return POOLS_MAP_LP[lp];
    }, [farmAddress]);

    const canVote = useMemo(() => {
        return farmAddress && weight >= 0 && !isPending;
    }, [farmAddress, weight, isPending]);

    useEffect(() => {
        setWeight(powerUsedForCurrentFarm);
    }, [powerUsedForCurrentFarm]);
    return (
        <div className="px-6 lg:px-20 pb-12 overflow-auto relative">
            <div className="sm:flex sm:space-x-8 lg:space-x-24 mb-7">
                <div className="flex flex-col grow mb-16 lg:mb-0">
                    <div className="font-bold text-2xl text-white mb-14">
                        Voting Panel
                    </div>
                    <div className="mb-6">
                        <div className="font-bold text-sm text-stake-gray-500 mb-4">
                            Select a Pool to vote
                        </div>
                        <div className="flex items-center">
                            <div className="grow mr-8">
                                <BasePopover
                                    className="absolute text-white left-0 top-2 w-full overflow-auto bg-ash-dark-700 "
                                    options={{
                                        placement: "bottom-start",
                                        modifiers: [
                                            {
                                                name: "offset",
                                                options: { offset: [0, 8] },
                                            },
                                        ],
                                    }}
                                    button={() => (
                                        <div className="w-full h-18 px-7 flex items-center justify-between text-xs sm:text-lg font-bold text-stake-gray-500 bg-ash-dark-400 cursor-pointer">
                                            {pool ? (
                                                <>
                                                    <div className="flex items-center">
                                                        <div className="flex mr-2">
                                                            {pool.tokens.map(
                                                                (t, i) => (
                                                                    <Avatar
                                                                        key={
                                                                            t.identifier
                                                                        }
                                                                        src={
                                                                            t.logoURI
                                                                        }
                                                                        className={`w-4 h-4 ${
                                                                            i ===
                                                                            0
                                                                                ? ""
                                                                                : "-ml-1"
                                                                        }`}
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                        <div>
                                                            {pool?.tokens
                                                                .map(
                                                                    (t) =>
                                                                        t.symbol
                                                                )
                                                                .join("-")}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>Select farm to start</>
                                            )}
                                            <ICChevronDown className="w-2 h-auto ml-1" />
                                        </div>
                                    )}
                                >
                                    {({ close }) => {
                                        return (
                                            <ul className="py-6 max-h-52">
                                                {ashBase.farmController?.farms?.map(
                                                    (f) => {
                                                        const farm =
                                                            FARMS_MAP[
                                                                f.address
                                                            ];
                                                        const tokens =
                                                            POOLS_MAP_LP[
                                                                farm
                                                                    .farming_token_id
                                                            ].tokens;
                                                        return (
                                                            <li
                                                                key={f.address}
                                                                className="relative"
                                                            >
                                                                <button
                                                                    className="w-full py-3 text-left px-6 text-xs font-bold"
                                                                    onClick={() => {
                                                                        setFarmAddress(
                                                                            f.address
                                                                        );
                                                                        close();
                                                                    }}
                                                                >
                                                                    {tokens
                                                                        .map(
                                                                            (
                                                                                t
                                                                            ) =>
                                                                                t.symbol
                                                                        )
                                                                        .join(
                                                                            "-"
                                                                        )}
                                                                </button>
                                                                {f.address ===
                                                                    farmAddress && (
                                                                    <span className="absolute w-[3px] h-5 bg-ash-cyan-500 top-1/2 -translate-y-1/2 left-0"></span>
                                                                )}
                                                            </li>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                        );
                                    }}
                                </BasePopover>
                            </div>
                            <div>
                                <OnboardTooltip
                                    placement="right"
                                    open={onboardingDAOFarmBribe && hasBribe}
                                    onArrowClick={() =>
                                        setOnboardedDAOFarmBribe(true)
                                    }
                                    content={
                                        <OnboardTooltip.Panel className="max-w-[14rem]">
                                            <div className="p-5 font-bold text-xs text-white">
                                                This{" "}
                                                <span className="text-stake-green-500">
                                                    farm bribed
                                                </span>{" "}
                                                has been activated!!{" "}
                                                <span className="text-stake-green-500">
                                                    Click
                                                </span>{" "}
                                                on it for more details!
                                            </div>
                                        </OnboardTooltip.Panel>
                                    }
                                >
                                    <CardTooltip
                                        autoPlacement
                                        disabled={!hasBribe}
                                        content={
                                            <div className="w-52 p-4">
                                                <div className="font-bold text-lg leading-tight text-stake-gray-500 mb-5">
                                                    <span className="text-pink-600">
                                                        Vote
                                                    </span>{" "}
                                                    to earn rewards
                                                </div>
                                                <div className="mb-4">
                                                    <div className="font-bold text-xs text-stake-gray-500 mb-2">
                                                        Total treasure
                                                    </div>
                                                    <div className="text-white">
                                                        <span>$</span>
                                                        <TextAmt
                                                            number={
                                                                totalRewardsUSD
                                                            }
                                                            className="font-bold"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="px-3 py-2 bg-ash-dark-400">
                                                    <div className="flex items-center font-bold text-2xs mb-2">
                                                        <ICLock className="w-3 h-3 mr-1" />
                                                        <div className="underline">
                                                            Lock reward
                                                        </div>
                                                    </div>
                                                    <div className="font-bold text-xs text-white">
                                                        {nextTime}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    >
                                        <div>
                                            <ICBribe
                                                className={`w-16 h-16 ${
                                                    hasBribe
                                                        ? "text-pink-600/80"
                                                        : "text-ash-dark-400/60 stroke-ash-dark-400"
                                                } `}
                                            />
                                        </div>
                                    </CardTooltip>
                                </OnboardTooltip>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="font-bold text-sm text-stake-gray-500 mb-4">
                            Vote power
                        </div>
                        <div className="h-18 px-7 flex items-center justify-end font-semibold text-lg bg-ash-dark-400 mb-4">
                            {(weight * 100) / 10000}%
                        </div>
                        <div>
                            <Slider
                                className="ash-slider ash-slider-pink my-0"
                                step={1}
                                marks={{
                                    0: <></>,
                                    2500: <></>,
                                    5000: <></>,
                                    7500: <></>,
                                    10000: <></>,
                                }}
                                handleStyle={{
                                    backgroundColor:
                                        theme.extend.colors.pink[600],
                                    borderRadius: 0,
                                    border:
                                        "2px solid " +
                                        theme.extend.colors.pink[600],
                                    width: 7,
                                    height: 7,
                                }}
                                min={0}
                                max={10000}
                                value={weight}
                                tooltip={{ open: false }}
                                onChange={(e) => {
                                    setWeight(
                                        Math.min(
                                            10000 -
                                                powerUsed +
                                                powerUsedForCurrentFarm,
                                            e
                                        )
                                    );
                                }}
                            />
                            <div className="flex justify-between mt-1">
                                <div className="text-xs lg:text-sm font-bold text-stake-gray-500">
                                    0%
                                </div>
                                <div className="text-xs lg:text-sm font-bold text-stake-gray-500">
                                    100%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full sm:w-1/3 lg:w-[17.8125rem] shrink-0 bg-stake-dark-500 py-[2.375rem] px-10">
                    <div className="font-bold text-lg text-white mb-14">
                        Estimated Increase
                    </div>
                    <div className="mb-10">
                        <div className="font-semibold text-xs text-stake-gray-500 mb-2">
                            Total vote on this Farm
                        </div>
                        <div className="font-bold text-lg text-stake-gray-500 mb-2 line-through">
                            {formatAmount(
                                farmWeight
                                    .idiv(10 ** VE_ASH_DECIMALS)
                                    .toNumber()
                            )}{" "}
                            veASH
                        </div>
                        <div className="font-bold text-lg text-white mb-2">
                            {formatAmount(
                                estimatedNextFarmWeight
                                    .idiv(10 ** VE_ASH_DECIMALS)
                                    .toNumber()
                            )}{" "}
                            veASH
                        </div>
                    </div>
                    <div>
                        <div className="font-semibold text-xs text-stake-gray-500 mb-2">
                            Farm weight changes
                        </div>
                        <div className="font-bold text-lg text-stake-gray-500 mb-2 line-through">
                            {formatAmount(
                                new BigNumber(farmRelativeWeight)
                                    .multipliedBy(100)
                                    .div(1e18)
                                    .toNumber()
                            )}
                            %
                        </div>
                        <div className="font-bold text-lg text-white mb-2">
                            {formatAmount(estimatedNextRelativeWeight)}%
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
                <div className="w-full sm:w-1/3 lg:w-[17.8125rem]">
                    <GlowingButton
                        theme="pink"
                        className="w-full h-12 flex items-center"
                        disabled={!canVote}
                        onClick={() => voteFarmWeight(farmAddress!, weight)}
                    >
                        <span className="font-bold text-sm uppercase mr-2">
                            Vote
                        </span>
                        <ICChevronRight className="w-3 h-3" />
                    </GlowingButton>
                </div>
            </div>
        </div>
    );
};

function FarmWeightVotingModal({ farmAddress, ...modalProps }: Props) {
    const screenSize = useScreenSize();
    return (
        <BaseModal
            {...modalProps}
            type={screenSize.isMobile ? "drawer_btt" : "modal"}
            className="clip-corner-4 clip-corner-tl bg-stake-dark-400 p-4 sm:w-screen sm:ash-container flex flex-col max-h-full"
        >
            <div className="flex justify-end mb-4">
                <BaseModal.CloseBtn />
            </div>
            <div className="grow overflow-auto">
                <FarmWeightVotingContent
                    {...modalProps}
                    farmAddress={farmAddress}
                />
            </div>
        </BaseModal>
    );
}

export default FarmWeightVotingModal;
