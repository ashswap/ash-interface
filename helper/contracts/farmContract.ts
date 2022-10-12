import Contract from "./contract";
import farmAbi from "assets/abi/farm.abi.json";
import { Address, TokenPayment } from "@elrondnetwork/erdjs/out";
import { getAddress } from "@elrondnetwork/dapp-core/utils";
import BigNumber from "bignumber.js";
import { FarmTokenAttrs } from "interface/farm";
import chunk from "lodash.chunk";
class FarmContract extends Contract {
    private readonly MAX_TOKEN_PROCESS = 5;
    constructor(address: string) {
        super(address, farmAbi);
    }

    private async _enterFarm(tokenPayments: TokenPayment[], selfBoost = false) {
        const sender = await getAddress();
        let interaction = this.contract.methods.enterFarm([selfBoost]);
        interaction.withMultiESDTNFTTransfer(
            tokenPayments,
            new Address(sender)
        );
        interaction.withGasLimit(100_000_000); // || 13_000_000 + tokenPayments.length * 2_000_000
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
        interaction.withGasLimit(100_000_000); // || 13_000_000 + tokenPayments.length * 2_000_000
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
        interaction.withGasLimit(100_000_000); // || 13_000_000 + tokenPayments.length * 2_500_000
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
}

export default FarmContract;
