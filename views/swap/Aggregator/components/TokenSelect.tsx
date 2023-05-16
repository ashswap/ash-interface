import ICChevronDown from "assets/svg/chevron-down.svg";
import Search from "assets/svg/search.svg";
import { tokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import BaseModal from "components/BaseModal";
import Input from "components/Input";
import { IN_POOL_TOKENS_MAP } from "const/pool";
import { NON_LP_TOKENS, TOKENS } from "const/tokens";
import { IESDTInfo } from "helper/token/token";
import { useScreenSize } from "hooks/useScreenSize";
import IPool from "interface/pool";
import { TokenBalance } from "interface/tokenBalance";
import { memo, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { useDebounce } from "use-debounce";
import ListToken from "views/swap/components/ListToken";

interface Props {
    onChange?: (t: IESDTInfo) => void;
    value?: IESDTInfo;
    validPools?: IPool[];
    pivotToken?: IESDTInfo;
    modalTitle: string;
    type: "from" | "to";
}

const TokenSelect = ({ value, onChange, modalTitle, type, pivotToken }: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("");
    const [debounceKeyword] = useDebounce(keyword, 100);
    const tokenMap = useRecoilValue(tokenMapState);
    const screenSize = useScreenSize();

    const tokenBalances = useMemo(() => {
        return NON_LP_TOKENS.filter(t => t.identifier !== pivotToken?.identifier).map(t => {
            const tokenBalance: TokenBalance = {
                token: t,
                balance: new BigNumber(tokenMap[t.identifier]?.balance || 0),
            };
            return tokenBalance;
        })
    }, [pivotToken?.identifier, tokenMap]);

    const onSelectToken = (t: IESDTInfo) => {
        setOpen(false);
        if (onChange) {
            onChange(t);
        }
    };

    const filteredTokenBalances = useMemo(() => {
        return tokenBalances.filter((t) =>
            t.token.symbol.toLowerCase().includes(debounceKeyword.toLowerCase())
        );
    }, [tokenBalances, debounceKeyword]);

    return (
        <>
            <div
                className={
                    `flex flex-row items-center justify-between text-sm font-bold cursor-pointer select-none px-4 h-12 rounded-xl space-x-6 transition-all ` +
                    (value
                        ? `bg-ash-dark-600 hover:bg-ash-dark-700 colored-drop-shadow-xs colored-drop-shadow-ash-gray-600/10 text-white`
                        : `bg-bg-select hover:bg-bg-select-hover text-pink-600 hover:shadow-[0px_4px_30px] hover:shadow-[#FF005C]/40`)
                }
                onClick={() => {
                    setOpen(true);
                }}
            >
                {value ? (
                    <div className="flex items-center">
                        <Avatar
                            src={value.logoURI}
                            alt={value.symbol}
                            className="w-4 h-4"
                        />
                        <div className="mt-0.5 ml-2 text-xs sm:text-sm font-bold">
                            {value.symbol}
                        </div>
                    </div>
                ) : (
                    <div className="text-xs sm:text-sm">Select a token</div>
                )}
                <ICChevronDown />
            </div>

            <BaseModal
                isOpen={open}
                onRequestClose={() => setOpen(false)}
                type={screenSize.msm ? "drawer_btt" : "modal"}
                className="clip-corner-4 clip-corner-tl bg-ash-dark-600 flex flex-col p-4 w-full sm:w-[27.375rem] mx-auto max-h-[80vh]"
            >
                <div className="flex justify-end">
                    <BaseModal.CloseBtn />
                </div>
                <div className="shrink-0 px-6 pt-1 pb-6">
                    <div className="font-bold text-lg text-white">
                        {modalTitle}
                    </div>
                    <div className="flex flex-row items-center pt-8 w-full overflow-hidden">
                        <Input
                            placeholder="Search"
                            suffix={<Search />}
                            outline
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                            }}
                            textClassName="text-sm"
                            className="w-full caret-pink-500 placeholder-ash-gray-600 overflow-hidden h-12 px-5"
                        />
                    </div>
                    <div className="font-normal text-xs text-white mt-10">
                        Supported Tokens
                    </div>
                </div>

                <div className="grow overflow-auto px-6 pb-7 min-h-[35vh] sm:min-h-[initial]">
                    <ListToken
                        className=""
                        items={filteredTokenBalances}
                        onSelect={(t) => onSelectToken(t.token)}
                    />
                </div>
            </BaseModal>
        </>
    );
};

export default memo(TokenSelect);
