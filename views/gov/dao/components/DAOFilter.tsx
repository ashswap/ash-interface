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
            <div className="duration-500 flex space-x-4 sm:space-x-8 font-bold text-sm sm:text-2xl text-stake-gray-500">
                <button
                    className={`${
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
            <div className="flex items-center justify-between gap-4 overflow-hidden">
                <div className="h-10 sm:h-12 px-4 sm:px-6 bg-ash-dark-600 flex items-center overflow-hidden">
                    <Switch
                        checked={DAODetailView}
                        onChange={(val) => setDAODetailView(val)}
                        className="flex items-center py-2 overflow-hidden"
                    >
                        <span className="inline-block ml-2 sm:mt-1 font-bold text-xs sm:text-sm text-stake-gray-500 truncate">
                            Detail View
                        </span>
                    </Switch>
                </div>
                <Link href="/gov/dao/propose" className="inline-block overflow-hidden">
                    <GlowingButton
                        theme="pink"
                        wrapperClassName="overflow-hidden max-w-full"
                        className="max-w-full clip-corner-1 clip-corner-br h-10 sm:h-12 px-4 sm:px-6 font-bold text-xs sm:text-sm overflow-hidden"
                    >
                        <span className="inline-block truncate">Create proposal</span>
                    </GlowingButton>
                </Link>
            </div>
        </div>
    );
}

export default memo(DAOFilter);
