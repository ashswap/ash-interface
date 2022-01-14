import BasicLayout from "components/Layout/Basic";
import ListPool from 'components/ListPool';
import PoolBanner from 'components/PoolBanner';
import PoolFilter, { ViewType } from 'components/PoolFilter';
import PoolMenu from 'components/PoolMenu';
import { TAILWIND_BREAKPOINT } from 'const/mediaQueries';
import pools from 'const/pool';
import useMediaQuery from 'hooks/useMediaQuery';
import type { NextPage } from 'next';
import { useState } from 'react';

const Home: NextPage = () => {
    const [view, setView] = useState<ViewType>(ViewType.Card);
    const [search, setSearch] = useState<string>("");
    const isSMScreen = useMediaQuery(`(max-width: ${TAILWIND_BREAKPOINT.SM}px)`);

    return (
        <BasicLayout>
            <div className='ash-container pb-40'>
            <div className='mb-12 w-full max-w-[55.375rem] mx-auto'>
            <PoolBanner />
            </div>
            <div>
                <PoolMenu />
                {/* disable change view type if the screen size is sm, and auto set view type to list on SM screen */}
                <PoolFilter view={isSMScreen ? ViewType.List : view} onChangeView={(view) => !isSMScreen && setView(view)} search={search} onSearch={setSearch} />
                <ListPool items={pools} view={isSMScreen ? ViewType.List : view} search={search} className="pt-2 md:pt-8" />
            </div>
            </div>
        </BasicLayout>
    )
}

export default Home
