import Image from 'next/image'
import Link from 'next/link'
import Button from 'components/Button'
import Nav from 'components/Nav'
import Wallet from 'assets/svg/wallet.svg'

const AppBar = () => {
    return (
        <div className="flex justify-between items-center px-12 py-5">
            <Link href="/" passHref>
                <div>
                    <Image src="/logo.png" alt="Ashswap logo" height={54} width={124} />
                </div>
            </Link>
            <Nav/>
            <Button leftIcon={<Wallet/>}>Connect wallet</Button>
        </div>
    )
}

export default AppBar;