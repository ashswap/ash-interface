import ICArrowRight from "assets/svg/arrow-right.svg";
import ICCopy from "assets/svg/copy.svg";
import ICNewTabRound from "assets/svg/new-tab-round.svg";
import ICStarOutline from "assets/svg/star-outline.svg";
import ICSwap from "assets/svg/swap.svg";
import ICArrowBottomRight from "assets/svg/arrow-bottom-right.svg";
import ICArrowTopRight from "assets/svg/arrow-top-right.svg";
import InfoLayout from "components/Layout/Info";
import { TOKENS } from "const/tokens";
import { IToken } from "interface/token";
import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import React, { ReactElement } from "react";
import TokenChart from "views/info/Tokens/[id]/TokenChart";

type Page<P = {}> = NextPage<P> & {
    getLayout?: (page: ReactElement) => ReactElement;
};
type props = { token: IToken };
const TokenDetailPage: Page<props> = ({ token }: props) => {
    return (
        <div>
            <div className="text-white py-7 max-w-6xl mx-auto px-6 sm:px-0">
                <ul className="flex space-x-1 text-xs mb-6">
                    <li>
                        <Link href="/info">
                            <a>
                                <span className="text-white">Dashboard</span>
                            </a>
                        </Link>
                    </li>
                    <li>
                        <ICArrowRight className="inline mr-1 text-ash-gray-500" />
                        <Link href="/info/tokens">
                            <a>
                                <span className="text-white">Tokens</span>
                            </a>
                        </Link>
                    </li>
                    <li>
                        <ICArrowRight className="inline mr-1 text-ash-gray-500" />
                        <span className="text-ash-gray-500">{token?.name}</span>
                    </li>
                </ul>
                <div className="flex items-center mb-[2.375rem]">
                    <h1 className="text-4xl font-bold text-white mr-4">
                        {token.name}
                    </h1>
                    <div className="w-8 h-8 mr-5">
                        <Image src={token.icon} alt={token.name} />
                    </div>
                    <div className="bg-ash-dark-600 h-10 flex items-center px-4 mr-2">
                        <div className="mr-3 text-sm">{token.name} Coin</div>
                        <div className="text-ash-gray-500 text-xs">
                            {token.id}
                        </div>
                        <div className="mx-4">|</div>
                        <button>
                            <ICCopy className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="bg-ash-dark-600 h-10 px-4 flex items-center text-sm">
                        <span className="text-ash-gray-500">$</span>
                        <span className="text-ash-green-500">1,000002</span>
                    </div>
                </div>
                <div className="flex space-x-2 mb-[4.5rem]">
                    {/* TODO: set swap pair by query params */}
                    <Link href="/swap">
                        <a>
                            <span className="bg-pink-600 h-10 flex items-center px-4 text-sm text-white">
                                <ICSwap className="w-5 h-5 mr-2" />
                                <span>Swap</span>
                            </span>
                        </a>
                    </Link>
                    <button className="bg-ash-dark-500 h-10 flex items-center px-4 text-sm">
                        <ICStarOutline className="w-5 h-5 mr-2" />
                        <span>Save</span>
                    </button>
                    <a href="">
                        <span className="bg-ash-dark-500 h-10 flex items-center px-4 text-sm text-white">
                            <ICNewTabRound className="w-5 h-5 mr-3" />
                            <span>View on Elrondscan</span>
                        </span>
                    </a>
                </div>
                <div className="flex flex-wrap xl:flex-nowrap overflow-hidden">
                    <div className="w-full xl:w-[16.625rem] flex flex-col space-y-2 mb-[4.5rem]">
                        <div className="h-[7.5rem] px-[1.625rem] pt-5 pb-8 bg-ash-dark-600 flex flex-col justify-between">
                            <div className="text-xs">Total Liquidity</div>
                            <div className="flex justify-between items-baseline">
                                <div className="text-lg">
                                    <span className="text-ash-gray-500">$</span>
                                    <span>1,000,000,000</span>
                                </div>
                                <div className="text-ash-purple-500 text-xs font-bold">
                                    <ICArrowBottomRight className="inline w-2 h-2 mr-1"/>
                                    <span>-19%</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[7.5rem] px-[1.625rem] pt-5 pb-8 bg-ash-dark-600 flex flex-col justify-between">
                            <div className="text-xs">Volume (24h)</div>
                            <div className="flex justify-between items-baseline">
                                <div className="text-lg">
                                    <span className="text-ash-gray-500">$</span>
                                    <span>1,000,000,000</span>
                                </div>
                                <div className="text-ash-purple-500 text-xs font-bold">
                                    <ICArrowBottomRight className="inline w-2 h-2 mr-1"/>
                                    <span>-19%</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[7.5rem] px-[1.625rem] pt-5 pb-8 bg-ash-dark-600 flex flex-col justify-between">
                            <div className="text-xs">Transactions (24h)</div>
                            <div className="flex justify-between items-baseline">
                                <div className="text-lg">
                                    <span className="text-ash-gray-500">$</span>
                                    <span>512</span>
                                </div>
                                <div className="text-ash-green-500 text-xs font-bold">
                                    <ICArrowTopRight className="inline w-2 h-2 mr-1"/>
                                    <span>19%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow h-[23.5rem] xl:ml-4 overflow-hidden mb-[4.5rem]">
                        <TokenChart/>
                    </div>
                </div>
            </div>
        </div>
    );
};
TokenDetailPage.getLayout = function getLayout(page: ReactElement) {
    return <InfoLayout>{page}</InfoLayout>;
};
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { id: tokenId } = params || {};
    const token = TOKENS.find((t) => t.id === tokenId);
    if (token) {
        return {
            props: { token },
        };
    }
    return {
        redirect: {
            destination: "/info",
            permanent: true,
        },
    };
};
export default TokenDetailPage;