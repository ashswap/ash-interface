import { walletTokenPriceState } from "atoms/walletState";
import BigNumber from "bignumber.js";
import { toEGLDD } from "helper/balance";
import { queryPoolContract } from "helper/contracts/pool";
import IPool from "interface/pool";
import { useRecoilCallback } from "recoil";

const useLPValue = () => {
    const getLPValue = useRecoilCallback(({snapshot}) => 
        async (ownLiquidity: BigNumber, pool: IPool) => {
            const tokenPrices = await snapshot.getPromise(walletTokenPriceState);
            const { value0, value1 } = await queryPoolContract.getTokenInLP(
                ownLiquidity,
                pool.address
            );
            let token0 = pool.tokens[0];
            let token1 = pool.tokens[1];

            if (!value0 || !value1) {
                return new BigNumber(0);
            }

            const valueUsd0 = toEGLDD(token0.decimals, value0).multipliedBy(
                tokenPrices[token0.id]
            );
            const valueUsd1 = toEGLDD(token1.decimals, value1).multipliedBy(
                tokenPrices[token1.id]
            );
            return valueUsd0.plus(valueUsd1);
        }
    );
    return getLPValue;
}

export default useLPValue;