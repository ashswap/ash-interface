import ICChevronDown from "assets/svg/chevron-down.svg";
import ICGrid from "assets/svg/grid.svg";
import ICList from "assets/svg/list.svg";
import ICSearch from "assets/svg/search.svg";
import {
    farmKeywordState,
    farmSortOptionState,
    FarmsState,
    farmStakedOnlyState,
    farmViewTypeState,
} from "atoms/farmsState";
import BasePopover from "components/BasePopover";
import Input from "components/Input";
import { useScreenSize } from "hooks/useScreenSize";
import React from "react";
import { useRecoilState } from "recoil";
export enum ViewType {
    Card,
    List,
}
const options: { value: FarmsState["sortOption"]; label: any }[] = [
    { value: "apr", label: "APR" },
    { value: "liquidity", label: "Liquidity" },
    { value: "volume", label: "24h Volume" },
];
function FarmFilter() {
    const [stakedOnly, setStakedOnly] = useRecoilState(farmStakedOnlyState);
    const [keyword, setKeyword] = useRecoilState(farmKeywordState);
    const [sortOption, setSortOption] = useRecoilState(farmSortOptionState);
    const [viewType, onChangeViewType] = useRecoilState(farmViewTypeState);
    const screenSize = useScreenSize();
    const SearchBox = (
        <Input
            className="w-full md:max-w-80 h-12 px-5"
            backgroundClassName="bg-ash-dark-700"
            textColorClassName="text-input-3"
            placeholder="Search farms"
            type="text"
            textAlign="left"
            textClassName="font-normal text-xs md:text-sm"
            suffix={<ICSearch />}
            value={keyword}
            onChange={(e) => {
                setKeyword(e.target.value);
            }}
        />
    );

    return (
        <div>
            <div className="flex space-x-4 mb-8">
                <button
                    className={`text-lg font-bold ${
                        !stakedOnly ? "text-ash-cyan-500" : "text-ash-gray-500"
                    }`}
                    onClick={() => setStakedOnly(false)}
                >
                    All Farms
                </button>
                <button
                    className={`text-lg font-bold ${
                        stakedOnly ? "text-ash-cyan-500" : "text-ash-gray-500"
                    }`}
                    onClick={() => setStakedOnly(true)}
                >
                    Your Farms
                </button>
            </div>
            <div>
                <div className={`flex flex-row justify-between mb-4 md:mb-0`}>
                    <div className="flex flex-row justify-center items-center overflow-hidden mr-2">
                        <button
                            className={`mr-2 shrink-0 ${
                                viewType === ViewType.Card
                                    ? "text-ash-cyan-500"
                                    : "text-ash-gray-500"
                            }`}
                            onClick={() => onChangeViewType(ViewType.Card)}
                        >
                            <ICGrid className="w-6 h-6" />
                        </button>
                        <button
                            className={`mr-2 lg:mr-8 shrink-0 ${
                                viewType === ViewType.List
                                    ? "text-ash-cyan-500"
                                    : "text-ash-gray-500"
                            }`}
                            onClick={() => onChangeViewType(ViewType.List)}
                        >
                            <ICList className="w-6 h-6" />
                        </button>
                        {screenSize.md && (
                            <div className="grow overflow-hidden">
                                {SearchBox}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                        <div>
                            <BasePopover
                                className="absolute w-full text-white left-0"
                                button={({ open }) => (
                                    <button
                                        className={`transition ease-in-out duration-200 w-40 lg:w-56 h-12 px-7 flex items-center justify-between ${
                                            open
                                                ? "bg-ash-dark-700 text-white"
                                                : "bg-ash-dark-600 text-ash-gray-500"
                                        }`}
                                    >
                                        <span className="font-bold text-xs lg:text-sm mr-2">
                                            Sort by:{" "}
                                            <span className="text-white">
                                                {
                                                    options.find(
                                                        (opt) =>
                                                            opt.value ===
                                                            sortOption
                                                    )?.label
                                                }
                                            </span>
                                        </span>
                                        <ICChevronDown className="w-3 h-auto text-ash-cyan-500" />
                                    </button>
                                )}
                            >
                                {({ close }) => (
                                    <ul className="bg-ash-dark-700 py-6">
                                        {options.map((opt) => {
                                            return (
                                                <li
                                                    key={opt.value}
                                                    className="relative"
                                                >
                                                    <button
                                                        className="w-full py-3 text-left px-6"
                                                        onClick={() => {
                                                            setSortOption(
                                                                opt.value
                                                            );
                                                            close();
                                                        }}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                    {opt.value ===
                                                        sortOption && (
                                                        <span className="absolute w-[3px] h-5 bg-ash-cyan-500 top-1/2 -translate-y-1/2 left-0"></span>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </BasePopover>
                        </div>
                    </div>
                </div>
                {!screenSize.md && SearchBox}
            </div>
        </div>
    );
}

export default FarmFilter;
