import Avatar from "components/Avatar";
import { POOLS_MAP_LP } from "const/pool";
import { getTokenFromId } from "helper/token";
import { memo, useMemo } from "react";
import DAODropdown from "./DAODropdown";
import { FARMS_MAP } from "const/farms";

function DAOFarmDropdown(
    {options, ...props}: Omit<Parameters<typeof DAODropdown>[0], "options"> & {options: string[]}
) {
    const farmOptions = useMemo(() => {
        return options.sort(f => POOLS_MAP_LP[FARMS_MAP[f]?.farming_token_id] ? -1 : 1).map((f) => ({
            label: (
                <div className="flex items-center gap-2">
                    <div className="flex items-center">
                        {POOLS_MAP_LP[FARMS_MAP[f]?.farming_token_id]?.tokens?.map((_t) => {
                            const t = getTokenFromId(_t.identifier);
                            return (
                                <Avatar
                                    key={t.identifier}
                                    src={t.logoURI}
                                    alt={t.name}
                                    className="w-3 h-3 -ml-0.5 first:ml-0"
                                />
                            );
                        })}
                    </div>
                    <div className="truncate">{f}</div>
                </div>
            ),
            value: f,
        }));
    }, [options]);
    return <DAODropdown {...props} options={farmOptions} />;
}

export default memo(DAOFarmDropdown);
