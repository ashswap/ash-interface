import { ENVIRONMENT } from "const/env";
import request, { gql } from "graphql-request";
import useSWR, { SWRConfiguration } from "swr";

const query = gql`
    query farmsInController {
        farmController {
            farms {
                address
            }
        }
    }
`;

const useFarmsInController = (swrConfig?: SWRConfiguration) => {
    return useSWR<string[]>('farmsInController', () => request(`${ENVIRONMENT.ASH_GRAPHQL}/graphql`, query).then(res => res?.farmController?.farms?.map((f: any) => f.address) || []), swrConfig);
}

export default useFarmsInController;