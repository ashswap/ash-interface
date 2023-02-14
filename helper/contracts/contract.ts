import { GAS_PRICE } from "@elrondnetwork/dapp-core/constants";
import { AccountInfoSliceNetworkType } from "@elrondnetwork/dapp-core/types";
import { getNetworkConfig } from "@elrondnetwork/dapp-core/utils";
import {
    AbiRegistry, Address, ArgSerializer,
    EndpointParameterDefinition, Interaction, ResultsParser, SmartContract, SmartContractAbi
} from "@elrondnetwork/erdjs/out";
import { gasLimitBuffer, maxGasLimit } from "const/dappConfig";
import { getProxyNetworkProvider } from "../proxy/util";
type AbiType = {
    types: Record<string, any>;
}
export default class Contract<T extends AbiType = any> {
    protected resultParser = new ResultsParser();
    address: Address;
    contract: SmartContract;
    abiRegistry: AbiRegistry;
    constructor(address: string, abi: T) {
        this.address = new Address(address);
        this.abiRegistry = AbiRegistry.create(abi as any);
        this.contract = new SmartContract({
            address: this.address,
            abi: new SmartContractAbi(this.abiRegistry),
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

    protected async runQuery(interaction: Interaction) {
        const res = await this.getProxy().queryContract(
            interaction.check().buildQuery()
        );
        return this.resultParser.parseQueryResponse(
            res,
            interaction.getEndpoint()
        );
    }

    protected getAbiType(typeName: string) {
        const type = this.abiRegistry.customTypes.find(
            (t) => t.getName() === typeName
        );
        if (!type) throw new Error("invalid custom type");
        return type;
    }

    parseCustomType<U = any>(data: string, typeName: keyof T["types"]): U {
        const arg = new ArgSerializer();
        const type = this.getAbiType(typeName as string);
        return arg
            .buffersToValues(
                [Buffer.from(data, "base64")],
                [new EndpointParameterDefinition("foo", "bar", type)]
            )[0]
            ?.valueOf();
    }
}
