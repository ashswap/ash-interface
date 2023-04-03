import Avatar from "components/Avatar";
import { FARMS } from "const/farms";
import { POOLS_MAP_LP } from "const/pool";
import { getTokenFromId } from "helper/token";
import React, { useMemo } from "react";
import DAODropdown from "./DAODropdown";

function DAOFarmDropdown(
    props: Omit<Parameters<typeof DAODropdown>[0], "options">
) {
    const farmOptions = useMemo(() => {
        return FARMS.map((f) => ({
            label: (
                <div className="flex items-center">
                    <div className="mr-2 flex items-center">
                        {POOLS_MAP_LP[f.farming_token_id]?.tokens?.map((_t) => {
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
                    <div className="truncate">{f.farm_address}</div>
                </div>
            ),
            value: f.farm_address,
        }));
    }, []);
    return <DAODropdown {...props} options={farmOptions} />;
}

export default DAOFarmDropdown;
