import { ashBaseStateRefresherAtom, gqlQueryOptionsSelector } from "atoms/ashswap";
import { accAddressState } from "atoms/dappState";
import { gql } from "graphql-request";
import { GraphOptions } from "graphql/type";
import { graphqlFetcher } from "helper/common";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useSWR from "swr";
import { SWRConfiguration } from "swr/dist/types";
const queryOptions: { [key in keyof GraphOptions]: string } = {
    withFC: gql`
        farmController(address: $accAddress) {
            address
            timeTotal
            totalWeight
            nextTotalWeight
            farms {
                address
                relativeWeight
                nextRelativeWeight
                farmType
                votedPoint{
                    bias
                    slope
                }
                nextVotedPoint{
                    bias
                    slope
                }
            }
            farmTypes {
                farmType
                name
                weight
                nextWeight
            }
            account{
                voteUserPower
                farms{
                    address
                    lastUserVote
                    voteUserSlope{
                        slope
                        power
                        end
                    }
                }
            }
        }
    `,
    withFB: gql`
        farmBribe(address: $accAddress){
            address
            whitelistTokens{
                id
                price
            }
            farms{
                address
                rewards{
                    tokenId
                    rewardPerVote
                    activePeriod
                    reserve
                    claimed
                    total
                }
            }
            account{
                farms{
                    address
                    rewards{
                        tokenId
                        lastUserClaim
                        claimable
                    }
                }
            }
        }
    `,
    withSupply: gql`
        ashSupply
    `,
    withRW: gql`
        rewarder {
            address
            rewardPerSec
        }
    `
};
const useAshBaseStateQuery = (config?: SWRConfiguration) => {
    const accAddress = useRecoilValue(accAddressState);
    const setAshBaseStateRefresher = useSetRecoilState(
        ashBaseStateRefresherAtom
    );
    const options = useRecoilValue(gqlQueryOptionsSelector);

    const swr = useSWR(
        [
            gql`
                query ashBaseStateQuery($accAddress: String = "") {
                    farms(address: $accAddress) {
                        address
                        farmToken {
                            ...allTokenProps
                        }
                        rewardToken {
                            ...allTokenProps
                        }
                        farmingToken {
                            ...allTokenProps
                        }
                        farmTokenSupply
                        rewardPerSec,
                        rewardPerShare
                        state
                        lastRewardBlockTs
                        divisionSafetyConstant
                        farmingTokenBalance
                        produceRewardEnabled
                        account {
                            slopeBoosted
                        }
                        shard
                        additionalRewards{
                            rewardPerSec
                            rewardPerShare
                            periodRewardEnd
                            tokenId
                        }
                    }
                    pools {
                        address
                        lpToken {
                            ...allTokenProps
                        }
                        tokens {
                            ...allTokenProps
                        }
                        reserves
                        underlyingPrices
                        totalSupply
                        swapFeePercent
                        adminFeePercent
                        ampFactor
                        state
                    }
                    poolsV2 {
                        address
                        lpToken {
                            ...allTokenProps
                        }
                        totalSupply
                        reserves
                        priceScale
                        ampFactor
                        gamma
                        xp
                        futureAGammaTime
                        d
                        midFee
                        outFee
                        feeGamma
                    }
                    tokens {
                        ...allTokenProps
                    }
                    votingEscrows(address: $accAddress) {
                        address
                        lockedToken {
                            ...allTokenProps
                        }
                        totalLock
                        veSupply
                        account {
                            locked {
                                amount
                                end
                            }
                        }
                    }
                    feeDistributor(address: $accAddress) {
                        address
                        rewardToken {
                            ...allTokenProps
                        }
                        account {
                            reward
                        }
                    }
                    blockchain {
                        blockShards {
                            shard
                            nonce
                        }
                    }

                    ${Object.entries(options).map(([k, v]) => {
                        return v ? queryOptions[k as keyof GraphOptions] : '';
                    }).join('\n')}
                }

                fragment allTokenProps on Token {
                    id
                    price
                }
            `,
            { accAddress },
        ],
        graphqlFetcher,
        { refreshInterval: 6000, ...config }
    );
    useEffect(() => {
        setAshBaseStateRefresher(() => swr.mutate);
    }, [setAshBaseStateRefresher, swr.mutate]);
    return swr;
};

export default useAshBaseStateQuery;
