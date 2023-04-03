import {
    DAODetailViewAtom,
    DAOFilterOpenProposalAtom
} from "atoms/daoState";
import GlowingButton from "components/GlowingButton";
import Switch from "components/Switch";
import Link from "next/link";
import { memo } from "react";
import { useRecoilState } from "recoil";

type DAOFilterProps = {};
function DAOFilter(props: DAOFilterProps) {
    const [DAODetailView, setDAODetailView] = useRecoilState(DAODetailViewAtom);
    const [isFilteredOpen, setIsFilteredOpen] = useRecoilState(
        DAOFilterOpenProposalAtom
    );
    return (
        <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="duration-500 flex font-bold text-2xl text-stake-gray-500">
                <button
                    className={`mr-8 ${
                        isFilteredOpen && "text-pink-600"
                    }`}
                    onClick={() => setIsFilteredOpen(true)}
                >
                    Open
                </button>
                <button
                    className={`${!isFilteredOpen && "text-pink-600"}`}
                    onClick={() => setIsFilteredOpen(false)}
                >
                    Closed
                </button>
            </div>
            <div className="flex items-center gap-4">
                <div className="h-12 px-6 bg-ash-dark-600 flex items-center">
                    <Switch
                        checked={DAODetailView}
                        onChange={(val) => setDAODetailView(val)}
                        className="flex items-center"
                    >
                        <span className="inline-block ml-2 mt-1 font-bold text-stake-gray-500">
                            Detail View
                        </span>
                    </Switch>
                </div>
                <Link href="/stake/gov/dao/propose">
                    <GlowingButton
                        theme="pink"
                        className="clip-corner-1 clip-corner-br h-12 px-6 font-bold text-sm"
                    >
                        Create proposal
                    </GlowingButton>
                </Link>
            </div>
        </div>
    );
}

export default memo(DAOFilter);
