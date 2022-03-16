import { FarmsState } from "context/farms";
import { Unarray } from "interface/utilities";
import usePoolDataFormat from "./usePoolDataFormat";

const useFarmDataFormat = (data: Unarray<FarmsState["farmToDisplay"]>) => {
    return usePoolDataFormat(data);
}
export default useFarmDataFormat;