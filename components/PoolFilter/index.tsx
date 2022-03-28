import CardGrey from "assets/svg/card-grey.svg";
import Card from "assets/svg/card.svg";
import ListGrey from "assets/svg/list-grey.svg";
import ICList from "assets/svg/list.svg";
import ICChevronDown from "assets/svg/chevron-down.svg";
import Search from "assets/svg/search.svg";
import BasePopover from "components/BasePopover";
import IconButton from "components/IconButton";
import Input from "components/Input";
import Select from "components/Select";
import { TAILWIND_BREAKPOINT } from "const/mediaQueries";
import { PoolsState, usePools } from "context/pools";
import useMediaQuery from "hooks/useMediaQuery";
import { useScreenSize } from "hooks/useScreenSize";
import { useMemo, useState } from "react";

export enum ViewType {
    Card,
    List,
}

interface Props {
    view?: ViewType;
    onChangeView: (view: ViewType) => void;
}
const options: { value: PoolsState["sortOption"]; label: any }[] = [
    { value: "apr", label: "APR" },
    { value: "liquidity", label: "Liquidity" },
    { value: "volume", label: "24h Volume" },
];
const PoolFilter = (props: Props) => {
    const [isLivedPool, setIsLivedPool] = useState(true);
    const screenSize = useScreenSize();

    const { keyword, setKeyword, sortOption, setSortOption } = usePools();
    const selectOpt = useMemo(() => {
        return options.find((o) => o.value === sortOption);
    }, [sortOption]);

    const SearchBox = (
        <Input
            className="w-full md:max-w-80 h-12 px-5"
            backgroundClassName="bg-ash-dark-700"
            textColorClassName="text-input-3"
            placeholder="Search pool"
            type="text"
            textAlign="left"
            textClassName="font-normal text-xs md:text-sm"
            suffix={<Search />}
            value={keyword}
            onChange={(e) => {
                setKeyword(e.target.value);
            }}
        />
    );
    return (
        <div>
            <div
                className={`flex mt-3.5 mb-4 md:mb-0 space-x-2 lg:space-x-7.5`}
            >
                <div className="flex-grow overflow-hidden max-w-[21.875rem]">
                    {SearchBox}
                </div>
                <BasePopover
                    className="absolute w-full text-white left-0"
                    button={({ open }) => (
                        <button
                            className={`transition ease-in-out duration-200 w-44 lg:w-56 h-12 px-4 lg:px-7 flex items-center justify-between ${
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
                                            (opt) => opt.value === sortOption
                                        )?.label
                                    }
                                </span>
                            </span>
                            <ICChevronDown className="w-3 h-auto text-pink-600" />
                        </button>
                    )}
                >
                    {({ close }) => (
                        <ul className="bg-ash-dark-700 py-6">
                            {options.map((opt) => {
                                return (
                                    <li key={opt.value} className="relative">
                                        <button
                                            className="w-full py-3 text-left px-6"
                                            onClick={() => {
                                                setSortOption(opt.value);
                                                close();
                                            }}
                                        >
                                            {opt.label}
                                        </button>
                                        {opt.value === sortOption && (
                                            <span className="absolute w-[3px] h-5 bg-pink-600 top-1/2 -translate-y-1/2 left-0"></span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </BasePopover>
            </div>
        </div>
    );
};

export default PoolFilter;
