import CardGrey from "assets/svg/card-grey.svg";
import Card from "assets/svg/card.svg";
import ListGrey from "assets/svg/list-grey.svg";
import List from "assets/svg/list.svg";
import Search from "assets/svg/search.svg";
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
const options: {value: PoolsState["sortOption"], label: any}[] = [
    { value: "apr", label: "APR" },
    { value: "liquidity", label: "Liquidity" },
    { value: "volume", label: "24h Volume" },
];
const PoolFilter = (props: Props) => {
    const [isLivedPool, setIsLivedPool] = useState(true);
    const screenSize = useScreenSize();

    const {keyword, setKeyword, sortOption, setSortOption} = usePools();
    const selectOpt = useMemo(() => {
        return options.find(o => o.value === sortOption);
    }, [sortOption])

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
                className={`flex flex-row justify-between mt-3.5 mb-4 md:mb-0`}
            >
                <div className="flex flex-row justify-center items-center overflow-hidden mr-2">
                    <IconButton
                        icon={<CardGrey />}
                        activeIcon={<Card />}
                        active={props.view == ViewType.Card}
                        className="mr-2 flex-shrink-0"
                        onClick={() => props.onChangeView(ViewType.Card)}
                    />
                    <IconButton
                        icon={<ListGrey />}
                        activeIcon={<List />}
                        active={props.view == ViewType.List}
                        className="mr-2 lg:mr-8 flex-shrink-0"
                        onClick={() => props.onChangeView(ViewType.List)}
                    />
                    {screenSize.md && (
                        <div className="flex-grow overflow-hidden">
                            {SearchBox}
                        </div>
                    )}
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <div className="flex p-1 bg-white dark:bg-ash-dark-600 text-xs sm:text-sm space-x-1 sm:space-x-2 text-ash-gray-500 font-bold">
                        <button
                            className={`h-8 sm:h-10 w-[4.5rem] sm:w-[6.5rem] font-bold text-center ${
                                isLivedPool && "bg-pink-600 text-white"
                            }`}
                        >
                            Live
                        </button>
                        <button
                            className={`h-8 sm:h-10 w-[4.5rem] sm:w-[6.5rem] font-bold text-center ${
                                !isLivedPool && "bg-pink-600 text-white"
                            }`}
                        >
                            Finished
                        </button>
                    </div>
                    {props.view === ViewType.Card && (
                        <div>
                            <Select prefix="Sort by" options={options} value={selectOpt} onChange={(val) => {val?.value && setSortOption(val.value as any)}} />
                        </div>
                    )}
                </div>
            </div>
            {!screenSize.md && SearchBox}
        </div>
    );
};

export default PoolFilter;
