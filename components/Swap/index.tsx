import { useState } from 'react'
import styles from './Swap.module.css'
import Fire from 'assets/images/fire.png'
import Image from 'next/image'
import IconButton from 'components/IconButton'
import SwapAmount from 'components/SwapAmount'
import Button from 'components/Button'
import Setting from 'components/Setting'
import Panel, {PanelContent} from 'components/Panel'
import Clock from 'assets/svg/clock.svg'
import SettingIcon from 'assets/svg/setting.svg'
import SettingActiveIcon from 'assets/svg/setting-active.svg'
import Revert from 'assets/svg/revert.svg'
import Wallet from 'assets/svg/wallet.svg'
import IToken from 'interface/token'

const Swap = () => {
    const [showSetting, setShowSetting] = useState<boolean>(false)
    const [tokenFrom, setTokenFrom] = useState<IToken | undefined>(undefined)
    const [tokenTo, setTokenTo] = useState<IToken | undefined>(undefined)

    return (
        <div className="flex flex-col items-center pt-3.5">
            <Panel>
                <PanelContent>
                    <div className={styles.fire}>
                        <Image src={Fire} width={151} height={230} alt="Ash"  />
                    </div>
                    <div className="flex flex-row justify-between px-4">
                        <div className="font-bold text-2xl">Swap</div>
                        <div className="flex flex-row gap-2">
                            <IconButton icon={<Clock />} />
                            <IconButton icon={<SettingIcon />} activeIcon={<SettingActiveIcon />} onClick={() => setShowSetting(!showSetting)} active={showSetting} />
                        </div>
                    </div>

                    <div className="relative pt-12">
                        <SwapAmount topLeftCorner onChange={setTokenFrom} poolWithToken={tokenTo} showQuickSelect={!tokenFrom && !!tokenTo} type='from'>
                            <div className={styles.revert}>
                                <Revert />
                            </div>
                        </SwapAmount>
                        <SwapAmount bottomRightCorner onChange={setTokenTo} poolWithToken={tokenFrom} showQuickSelect={!!tokenFrom && !tokenTo} type='to' />
                    </div>

                    {
                        tokenFrom && tokenTo && (
                            <div className="flex flex-row justify-between text-xs text-white my-5">
                                <div className="opacity-50">Rate</div>
                                <div>1 {tokenFrom?.name} = 0.9999 {tokenTo?.name}</div>
                            </div>
                        )
                    }

                    <Button
                        leftIcon={<Wallet/>}
                        topLeftCorner
                        style={{height: 48}}
                        className="mt-12"
                        outline
                    >CONNECT WALLET</Button>
                </PanelContent>
                {
                    showSetting && <Setting onClose={() => setShowSetting(false)} />
                }
            </Panel>
        </div>
    )
}

export default Swap;