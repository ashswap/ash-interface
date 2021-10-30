import { useEffect } from 'react';
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import BasicLayout from "components/Layout/Basic";

const Home: NextPage = () => {
    const router = useRouter()

    useEffect(() => {
        if (router.route === "/") {
            router.replace("/swap")
        }
    }, [router])

    return (
        <BasicLayout>
            
        </BasicLayout>
    )
}

export default Home
