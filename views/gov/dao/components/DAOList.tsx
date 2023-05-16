import { Transition } from "@headlessui/react";
import ImgASHSleep from "assets/images/ash-sleep.png";
import {
    DAODetailViewAtom,
    DAOFilterOpenProposalAtom,
    DAOFilterStatusClosedOptionsAtom,
    DAOFilterStatusOpenOptionsAtom
} from "atoms/daoState";
import Checkbox from "components/Checkbox";
import Image from "components/Image";
import { DAOProposal } from "graphql/type.graphql";
import produce from "immer";
import { memo, useCallback, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import DAOCard from "./DAOCard";
const DAOFilterStatus = memo(function DAOFilterStatus() {
    const [DAOStatusOpenOptions, setDAOStatusOpenOptions] = useRecoilState(
        DAOFilterStatusOpenOptionsAtom
    );
    const [DAOStatusClosedOptions, setDAOStatusClosedOptions] = useRecoilState(
        DAOFilterStatusClosedOptionsAtom
    );
    const isFilterOpen = useRecoilValue(DAOFilterOpenProposalAtom);
    const options = useMemo(
        () => (isFilterOpen ? DAOStatusOpenOptions : DAOStatusClosedOptions),
        [isFilterOpen, DAOStatusOpenOptions, DAOStatusClosedOptions]
    );
    const onCheck = useCallback(
        (index: number) => {
            if (isFilterOpen) {
                setDAOStatusOpenOptions((state) =>
                    produce(state, (draft) => {
                        draft[index].checked = !draft[index].checked;
                    })
                );
            } else {
                setDAOStatusClosedOptions((state) =>
                    produce(state, (draft) => {
                        draft[index].checked = !draft[index].checked;
                    })
                );
            }
        },
        [isFilterOpen, setDAOStatusClosedOptions, setDAOStatusOpenOptions]
    );
    return (
        <div className="flex flex-col gap-2 max-w-[10rem]">
            {options.map((opt, i) => {
                return (
                    <div
                        key={opt.value}
                        className="py-4 px-6 flex items-center bg-ash-dark-600"
                    >
                        <Checkbox
                            checked={opt.checked}
                            text={opt.label}
                            onChange={() => onCheck(i)}
                            className="font-bold text-sm text-white"
                        />
                    </div>
                );
            })}
        </div>
    );
});
type DAOListProps = {
    proposals: DAOProposal[];
    pagination?: React.ReactNode;
};
function DAOList({ proposals, pagination }: DAOListProps) {
    const isFilterOpen = useRecoilValue(DAOFilterOpenProposalAtom);
    const detailView = useRecoilValue(DAODetailViewAtom);
    const label = useMemo(() => {
        return isFilterOpen ? "Open" : "Closed";
    }, [isFilterOpen]);
    const DAOStatusOpenOptions = useRecoilValue(DAOFilterStatusOpenOptionsAtom);
    const DAOStatusClosedOptions = useRecoilValue(
        DAOFilterStatusClosedOptionsAtom
    );
    const displayProposals = useMemo(() => {
        if (isFilterOpen) {
            return proposals.filter((p) =>
                DAOStatusOpenOptions.some(
                    (opt) => opt.checked && opt.value === p.state
                )
            );
        }
        return proposals.filter((p) =>
            DAOStatusClosedOptions.some(
                (opt) => opt.checked && opt.value === p.state
            )
        );
    }, [DAOStatusClosedOptions, DAOStatusOpenOptions, isFilterOpen, proposals]);
    return (
        <Transition
            appear
            show
            enter="transition-all duration-300"
            enterFrom="translate-y-1/2 opacity-0"
            enterTo="translate-y-0 opacity-100"
        >
            <div className="relative flex gap-y-10 flex-col md:flex-row">
                <div className="shrink-0 md:w-48">
                    <div className="md:absolute inset-x-0 z-[-1]">
                        <div
                            className="mb-3 border-b border-b-ash-gray-600 text-left font-bold text-3xl md:text-[3.5rem] leading-tight text-ash-gray-600 uppercase"
                            style={{
                                WebkitTextStroke: "1px currentColor",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            {label}
                        </div>
                        <div className="font-bold text-lg text-white text-left">
                            {displayProposals.length} {displayProposals.length > 1 ? "proposals" : "proposal"}
                        </div>
                    </div>
                    <div className="mt-12 md:mt-40 md:w-48">
                        <DAOFilterStatus />
                    </div>
                </div>
                <div className="grow flex flex-col gap-10">
                    {displayProposals.length > 0 ? (
                        <div className="transition-all grid lg:grid-cols-2 gap-x-7.5 gap-y-[3.25rem]">
                            {displayProposals.map((p) => {
                                return (
                                    <Transition
                                        key={p.proposal_id}
                                        appear
                                        enter="transition-all duration-300"
                                        enterFrom="scale-95 opacity-0"
                                        enterTo="scale-100 opacity-100"
                                    >
                                        <DAOCard
                                            key={p.proposal_id}
                                            detail={detailView}
                                            proposal={p}
                                        />
                                    </Transition>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-40">
                            <div className="flex items-center justify-center">
                                <div className="w-32 lg:w-36">
                                    <Image
                                        src={ImgASHSleep}
                                        alt="ash sleep"
                                        className="grayscale"
                                    />
                                </div>
                                <div className="text-sm lg:text-lg font-bold text-ash-gray-600">
                                    <div className="mb-2 text-sm lg:text-2xl">
                                        No result available
                                    </div>
                                    <div className="text-xs lg:text-sm">
                                        Please try another filter
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {pagination}
                </div>
            </div>
        </Transition>
    );
}

export default memo(DAOList);
