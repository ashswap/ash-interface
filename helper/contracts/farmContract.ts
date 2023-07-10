import Contract from "./contract";
import farmAbi from "assets/abi/farm.abi.json";
import { Address, TokenTransfer } from "@multiversx/sdk-core/out";
import { getAddress } from "@multiversx/sdk-dapp/utils";
import BigNumber from "bignumber.js";
import { FarmTokenAttrs } from "interface/farm";
import chunk from "lodash.chunk";
import moment from "moment";
import { WEEK } from "const/ve";
import { TokenAmount } from "helper/token/tokenAmount";
import { IESDTInfo } from "helper/token/token";
import { FarmToken } from "atoms/farmsState";

type FarmContractContext = {
    lastRewardBlockTs?: number;
    numberOfAdditionalRewards?: number;
    divisionSafetyConstant?: number;
};
class FarmContract extends Contract<typeof farmAbi> {
    private readonly MAX_TOKEN_PROCESS = 5;
    context: FarmContractContext = {};
    constructor(address: string) {
        super(address, farmAbi);
    }

    private _getBaseGasLimit() {
        const { lastRewardBlockTs = 0, numberOfAdditionalRewards = 0 } =
            this.context || {};
        // fallback to 5 weeks
        const week =
            lastRewardBlockTs === 0
                ? 5
                : Math.floor(moment().unix() / WEEK) -
                  Math.floor(lastRewardBlockTs / WEEK);
        // each interation by week of checkpoint cost 8_000_000 (farm contract) + checkpoint farm (farm controller) cost 20_000_000
        return (
            week * 8_000_000 +
            20_000_000 +
            numberOfAdditionalRewards * 4_000_000
        );
    }

    private async _enterFarm(
        tokenPayments: TokenTransfer[],
        selfBoost = false
    ) {
        const sender = await getAddress();
        let interaction = this.contract.methods.enterFarm([selfBoost]);
        interaction
            .withMultiESDTNFTTransfer(tokenPayments)
            .withSender(new Address(sender));
        interaction.withGasLimit(
            20_000_000 +
                tokenPayments.length * 2_000_000 +
                this._getBaseGasLimit()
        );
        return this.interceptInteraction(interaction);
    }

    private async _exitFarm(tokenPayments: TokenTransfer[]) {
        const sender = await getAddress();
        let interaction = this.contract.methods.exitFarm([]);
        interaction
            .withMultiESDTNFTTransfer(tokenPayments)
            .withSender(new Address(sender));
        interaction.withGasLimit(
            20_000_000 +
                tokenPayments.length * 2_000_000 +
                this._getBaseGasLimit()
        );
        return this.interceptInteraction(interaction);
    }

    private async _claimRewards(
        tokenPayments: TokenTransfer[],
        selfBoost = false
    ) {
        const sender = await getAddress();
        let interaction = this.contract.methods.claimRewards([selfBoost]);
        interaction
            .withMultiESDTNFTTransfer(tokenPayments)
            .withSender(new Address(sender));
        interaction.withGasLimit(
            20_000_000 +
                tokenPayments.length * 2_500_000 +
                this._getBaseGasLimit()
        );
        return this.interceptInteraction(interaction);
    }

    async enterFarm(tokenPayments: TokenTransfer[], selfBoost = false) {
        return await this._enterFarm(
            tokenPayments.slice(0, this.MAX_TOKEN_PROCESS),
            selfBoost
        );
    }

    async exitFarm(tokenPayments: TokenTransfer[]) {
        return Promise.all(
            chunk(tokenPayments, this.MAX_TOKEN_PROCESS).map((payments) =>
                this._exitFarm(payments)
            )
        );
    }

    async claimRewards(tokenPayments: TokenTransfer[], selfBoost = false) {
        return Promise.all(
            chunk(tokenPayments, this.MAX_TOKEN_PROCESS).map((payments) =>
                this._claimRewards(payments, selfBoost)
            )
        );
    }

    async calculateRewardsForGivenPosition(
        wei: BigNumber,
        attrs: FarmTokenAttrs
    ) {
        let interaction =
            this.contract.methods.calculateRewardsForGivenPosition([
                wei,
                attrs,
            ]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as BigNumber) || new BigNumber(0);
    }

    async getSlopeBoosted(address: string) {
        let interaction = this.contract.methods.getSlopeBoosted([address]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as BigNumber) || new BigNumber(0);
    }

    withContext(context: FarmContractContext) {
        this.context = context;
        return this;
    }

    static estimateAdditionalRewards(
        farmTokens: FarmToken[],
        divisionSafetyConstant: BigNumber,
        lpAmount: BigNumber,
        lastRewardBlockTs: number,
        additionalRewards: {
            token: IESDTInfo;
            rewardPerShare: BigNumber.Value;
            rewardPerSec: BigNumber.Value;
            periodRewardEnd: number;
        }[]
    ) {
        const currentTs = moment().unix();
        const rewardMap: Record<string, BigNumber> = {};
        const rewardMapRaw = Object.fromEntries(
            additionalRewards.map((t) => [t.token.identifier, t]) || []
        );
        if (lpAmount.gt(0) && divisionSafetyConstant.gt(0)) {
            farmTokens.map((ft) => {
                const rewardTokensFromAttrs = Object.fromEntries(
                    ft.attributes.reward_tokens.map((t) => [t.token, t])
                );
                additionalRewards.map((r) => {
                    const t = rewardTokensFromAttrs[r.token.identifier] || {
                        token: r.token.identifier,
                        reward_per_share: new BigNumber(0),
                    };
                    if (!rewardMap[t.token])
                        rewardMap[t.token] = new BigNumber(0);
                    const rawData = rewardMapRaw[t.token];
                    const lp = ft.balance.idiv(ft.perLP);
                    const amt = new BigNumber(
                        rawData
                            ? new BigNumber(rawData.rewardPerShare).minus(
                                  t.reward_per_share
                              )
                            : 0
                    )
                        .multipliedBy(lp)
                        .idiv(
                            divisionSafetyConstant.multipliedBy(
                                divisionSafetyConstant
                            )
                        );

                    const time = Math.max(
                        Math.min(currentTs, rawData.periodRewardEnd) -
                            lastRewardBlockTs,
                        0
                    );
                    const rewardIncrease = new BigNumber(
                        rawData.rewardPerSec
                    ).multipliedBy(time);
                    const increaseAmt = rewardIncrease
                        .multipliedBy(lp)
                        .idiv(lpAmount);
                    rewardMap[t.token] = rewardMap[t.token]
                        .plus(amt)
                        .plus(increaseAmt);
                });
            });
        }
        const rewards: TokenAmount[] = Object.entries(rewardMap).map(
            ([tokenId, r]) => {
                return new TokenAmount(rewardMapRaw[tokenId].token, r);
            }
        );
        return rewards;
    }
}

export default FarmContract;
