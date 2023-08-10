import { ashswapBaseState } from "atoms/ashswap";
import {
    fcFarmWeightChartRecordsAtom,
    fcNextFarmWeightChartRecordsAtom,
} from "atoms/farmControllerState";
import BigNumber from "bignumber.js";
import { HEX_COLORS } from "const/colors";
import { FARMS_MAP } from "const/farms";
import { POOLS_MAP_LP } from "const/pool";
import { getHexColor } from "helper/color";
import { getTokenFromId } from "helper/token";
import { FarmWeightChartRecord } from "interface/chart";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

const useFarmControllerState = () => {
    const ashBase = useRecoilValue(ashswapBaseState);
    const setFarmWeightChartRecord = useSetRecoilState(
        fcFarmWeightChartRecordsAtom
    );
    const setNextFarmWeightChartRecord = useSetRecoilState(
        fcNextFarmWeightChartRecordsAtom
    );

    useEffect(() => {
        if (!ashBase.farmController?.farms) return;
        const records: FarmWeightChartRecord[] = [];
        const nextRecords: FarmWeightChartRecord[] = [];
        ashBase.farmController.farms.filter(f => !!FARMS_MAP[f.address]).map((f, i) => {
            const lp = FARMS_MAP[f.address].farming_token_id;
            const pool = POOLS_MAP_LP[lp];
            const name = pool.tokens.map((t) => getTokenFromId(t.identifier).symbol).join("-");
            const color = HEX_COLORS[i] || getHexColor(lp);
            const record: FarmWeightChartRecord = {
                name,
                farmAddress: f.address,
                value: new BigNumber(f.relativeWeight).div(10 ** 14).toNumber(),
                color,
                totalVe: new BigNumber(f.votedPoint.bias).div(1e18).toNumber()
            };
            const nextRecord: FarmWeightChartRecord = {
                name,
                farmAddress: f.address,
                value: new BigNumber(f.nextRelativeWeight)
                    .div(10 ** 14)
                    .toNumber(),
                color,
                totalVe: new BigNumber(f.nextVotedPoint.bias).div(1e18).toNumber()
            };
            records.push(record);
            nextRecords.push(nextRecord);
        });

        setFarmWeightChartRecord(records);
        setNextFarmWeightChartRecord(nextRecords);
    }, [
        ashBase.farmController,
        setFarmWeightChartRecord,
        setNextFarmWeightChartRecord,
    ]);
};

export default useFarmControllerState;
