import type { NextPage } from 'next'
import BasicLayout from "components/Layout/Basic";
import Swap from 'components/Swap'
import { SwapProvider } from 'context/swap';

const Home: NextPage = () => {
    return (
        <BasicLayout>
            <SwapProvider>
                <Swap />
            </SwapProvider>
        </BasicLayout>
    )
}

export default Home
