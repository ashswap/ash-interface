import { gasPrice } from "@elrondnetwork/dapp-core/constants";
import { AccountInfoSliceNetworkType } from "@elrondnetwork/dapp-core/types";
import { getNetworkConfig } from "@elrondnetwork/dapp-core/utils";
import { ResultsParser, Interaction } from "@elrondnetwork/erdjs/out";
import { gasLimitBuffer, maxGasLimit } from "const/dappConfig";
import { getProxyNetworkProvider } from "../proxy/util";

export default class Contract {
    resultParser = new ResultsParser();
    getProxy() {
        return getProxyNetworkProvider();
    }

    interceptInteraction(interaction: Interaction) {
        const network: AccountInfoSliceNetworkType = getNetworkConfig();
        return interaction
            .withChainID(network.chainId)
            .withGasPrice(gasPrice)
            .withGasLimit(
                Math.min(
                    Math.floor(
                        interaction.getGasLimit().valueOf() * gasLimitBuffer
                    ),
                    maxGasLimit
                )
            );
    }
}
