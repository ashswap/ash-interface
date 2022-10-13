import { ashBaseStateRefresherAtom } from "atoms/ashswap";
import { accAddressState } from "atoms/dappState";
import { gql } from "graphql-request";
import { graphqlFetcher } from "helper/common";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useSWR from "swr";
import { SWRConfiguration } from "swr/dist/types";
const useAshBaseStateQuery = (config?: SWRConfiguration) => {
    const accAddress = useRecoilValue(accAddressState);
    const setAshBaseStateRefresher = useSetRecoilState(ashBaseStateRefresherAtom);
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
                        perBlockReward
                        rewardPerShare
                        state
                        lastRewardBlockNone
                        divisionSafetyConstant
                        farmingTokenBalance
                        account {
                            slopeBoosted
                        }
                        shard
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
                        totalSupply
                        swapFeePercent
                        adminFeePercent
                        ampFactor
                        state
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
                    ashSupply
                }

                fragment allTokenProps on Token {
                    id
                    price
                }
            `,
            { accAddress },
        ],
        graphqlFetcher,
        {refreshInterval: 6000, ...config}
    );
    useEffect(() => {
        setAshBaseStateRefresher(() => swr.mutate);
    }, [setAshBaseStateRefresher, swr.mutate]);
    return swr;
};

export default useAshBaseStateQuery;
