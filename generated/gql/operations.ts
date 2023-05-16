import gql from 'graphql-tag';
export const AllTokenProps = gql`
    fragment allTokenProps on Token {
  id
  price
}
    `;
export const AshBaseStateQuery = gql`
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
    rewardPerSec
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
    additionalRewards {
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
}
    ${AllTokenProps}`;