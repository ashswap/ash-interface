import type { NextPage } from 'next'
import BasicLayout from "components/Layout/Basic";
import Swap from 'components/Swap'

const Home: NextPage = () => {
    return (
        <BasicLayout>
            <Swap />
        </BasicLayout>
    )
}

export default Home
