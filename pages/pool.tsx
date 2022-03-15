import BasicLayout from "components/Layout/Basic";
import ListPool from "components/ListPool";
import PoolBanner from "components/PoolBanner";
import PoolFilter, { ViewType } from "components/PoolFilter";
import PoolMenu from "components/PoolMenu";
import pools from "const/pool";
import PoolsProvider from "context/pools";
import { useScreenSize } from "hooks/useScreenSize";
import type { NextPage } from "next";
import { useState } from "react";

const Home: NextPage = () => {
    const [view, setView] = useState<ViewType>(ViewType.Card);
    const {isMobile} = useScreenSize();

    return (
        <BasicLayout>
            <PoolsProvider>
                <div className="ash-container pb-40">
                    <div className="mb-12 w-full max-w-[55.375rem] mx-auto">
                        <PoolBanner />
                    </div>
                    <div>
                        <PoolMenu />
                        {/* disable change view type if the screen size is sm, and auto set view type to list on SM screen */}
                        <PoolFilter
                            view={isMobile ? ViewType.List : view}
                            onChangeView={(view) =>
                                !isMobile && setView(view)
                            }
                        />
                        <ListPool
                            items={pools}
                            view={isMobile ? ViewType.List : view}
                            className="pt-2 md:pt-8"
                        />
                    </div>
                </div>
            </PoolsProvider>
        </BasicLayout>
    );
};

export default Home;
