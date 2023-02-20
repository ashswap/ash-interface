import Contract from "./contract";
import farmAbi from "assets/abi/farm.abi.json";
import { Address, TokenPayment } from "@elrondnetwork/erdjs/out";
import { getAddress } from "@elrondnetwork/dapp-core/utils";
import BigNumber from "bignumber.js";
import { FarmTokenAttrs } from "interface/farm";
import chunk from "lodash.chunk";
import moment from "moment";
import { WEEK } from "const/ve";
class FarmContract extends Contract<typeof farmAbi> {
    private readonly MAX_TOKEN_PROCESS = 5;
    lastRewardBlockTs = 0;
    constructor(address: string) {
        super(address, farmAbi);
    }

    private _getBaseGasLimit() {
        // fallback to 5 weeks
        const week = this.lastRewardBlockTs === 0 ? 5 : Math.floor(moment().unix() / WEEK) - Math.floor(this.lastRewardBlockTs / WEEK);
        // each interation by week of checkpoint cost 12_000_000 (farm contract) + checkpoint farm (farm controller) cost 10_000_000
        return week * 12_000_000 + 10_000_000;
    }

    private async _enterFarm(tokenPayments: TokenPayment[], selfBoost = false) {
        const sender = await getAddress();
        let interaction = this.contract.methods.enterFarm([selfBoost]);
        interaction.withMultiESDTNFTTransfer(
            tokenPayments,
            new Address(sender)
        );
        interaction.withGasLimit(20_000_000 + tokenPayments.length * 2_000_000 + this._getBaseGasLimit());
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }

    private async _exitFarm(tokenPayments: TokenPayment[]) {
        const sender = await getAddress();
        let interaction = this.contract.methods.exitFarm([]);
        interaction.withMultiESDTNFTTransfer(
            tokenPayments,
            new Address(sender)
        );
        interaction.withGasLimit(20_000_000 + tokenPayments.length * 2_000_000 + this._getBaseGasLimit());
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }

    private async _claimRewards(
        tokenPayments: TokenPayment[],
        selfBoost = false
    ) {
        const sender = await getAddress();
        let interaction = this.contract.methods.claimRewards([selfBoost]);
        interaction.withMultiESDTNFTTransfer(
            tokenPayments,
            new Address(sender)
        );
        interaction.withGasLimit(20_000_000 + tokenPayments.length * 2_500_000 + this._getBaseGasLimit());
        return this.interceptInteraction(interaction)
            .check()
            .buildTransaction();
    }

    async enterFarm(tokenPayments: TokenPayment[], selfBoost = false) {
        return await this._enterFarm(tokenPayments.slice(0, this.MAX_TOKEN_PROCESS), selfBoost);
    }

    async exitFarm(tokenPayments: TokenPayment[]) {
        return Promise.all(
            chunk(tokenPayments, this.MAX_TOKEN_PROCESS).map((payments) =>
                this._exitFarm(payments)
            )
        );
    }

    async claimRewards(tokenPayments: TokenPayment[], selfBoost = false) {
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

    withLastRewardBlockTs(ts: number){
        this.lastRewardBlockTs = ts;
        return this;
    }
}

export default FarmContract;
