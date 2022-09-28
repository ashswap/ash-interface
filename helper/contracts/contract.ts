import { GAS_PRICE } from "@elrondnetwork/dapp-core/constants";
import { AccountInfoSliceNetworkType } from "@elrondnetwork/dapp-core/types";
import { getNetworkConfig } from "@elrondnetwork/dapp-core/utils";
import { ResultsParser, Interaction, SmartContract, Address, AbiRegistry, SmartContractAbi } from "@elrondnetwork/erdjs/out";
import { gasLimitBuffer, maxGasLimit } from "const/dappConfig";
import { getProxyNetworkProvider } from "../proxy/util";

export default class Contract {
    protected resultParser = new ResultsParser();
    address: Address;
    contract: SmartContract
    constructor(address: string, abi: any){
        this.address = new Address(address);
        const abiRegistry = AbiRegistry.create(abi);
        this.contract = new SmartContract({
            address: this.address,
            abi: new SmartContractAbi(abiRegistry),
        });
    }
    protected getProxy() {
        return getProxyNetworkProvider();
    }

    protected interceptInteraction(interaction: Interaction) {
        const network: AccountInfoSliceNetworkType = getNetworkConfig();
        return interaction
            .withChainID(network.chainId)
            .withGasPrice(GAS_PRICE)
            .withGasLimit(
                Math.min(
                    Math.floor(
                        interaction.getGasLimit().valueOf() * gasLimitBuffer
                    ),
                    maxGasLimit
                )
            );
    }

    protected async runQuery(interaction: Interaction){
        const res = await this.getProxy().queryContract(interaction.check().buildQuery());
        return this.resultParser.parseQueryResponse(res, interaction.getEndpoint());
    }
}
