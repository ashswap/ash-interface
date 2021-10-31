import { useState } from 'react'
import styles from './Swap.module.css'
import Fire from 'assets/images/fire.png'
import Image from 'next/image'
import IconButton from 'components/IconButton'
import SwapAmount from 'components/SwapAmount'
import Button from 'components/Button'
import Clock from 'assets/svg/clock.svg'
import SettingIcon from 'assets/svg/setting.svg'
import SettingActiveIcon from 'assets/svg/setting-active.svg'
import Revert from 'assets/svg/revert.svg'
import Wallet from 'assets/svg/wallet.svg'
import Setting from 'components/Setting'

const Swap = () => {
    const [showSetting, setShowSetting] = useState<boolean>(false)

    return (
        <div className="flex flex-col items-center pt-3.5">
            <div className={styles.corner}>
                <div className={styles.fire}>
                    <Image src={Fire} width={151} height={230} alt="Ash"  />
                </div>
                <div className={styles.container}>
                    <div className="flex flex-row justify-between px-4">
                        <div className="font-bold text-2xl">Swap</div>
                        <div className="flex flex-row gap-2">
                            <IconButton icon={<Clock />} />
                            <IconButton icon={<SettingIcon />} activeIcon={<SettingActiveIcon />} onClick={() => setShowSetting(!showSetting)} active={showSetting} />
                        </div>
                    </div>

                    <div className="relative py-12">
                        <SwapAmount topLeftCorner />
                        <SwapAmount bottomRightCorner />
                        <div className={styles.revert}>
                            <Revert />
                        </div>
                    </div>

                    <Button
                        leftIcon={<Wallet/>}
                        topLeftCorner
                        style={{height: 48}}
                        outline
                    >CONNECT WALLET</Button>
                </div>
                {
                    showSetting && <Setting />
                }
            </div>
        </div>
    )
}

export default Swap;