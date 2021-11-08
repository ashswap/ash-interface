import { useState } from 'react'
import IconClose from 'assets/svg/close.svg'
import IconButton from 'components/IconButton'
import SlippageSelect from 'components/SlippageSelect'
import styles from './Setting.module.css'
import Input from 'components/Input'

interface Props {
    onClose?: () => void
}

const Setting = (props: Props) => {
    const [slippage, setSlippage] = useState<string>("0.1%")

    return (
        <div className={styles.container}>
            <div className="absolute top-4 right-4">
                <IconButton icon={<IconClose />} onClick={props.onClose} />
            </div>
            <div className="font-bold text-lg">Setting</div>
            <div className="font-normal text-xs mt-14">Slippage Tolerance</div>
            <div className="flex flex-row gap-1 my-5">
                <SlippageSelect active={slippage === "0.1%"} onClick={() => setSlippage("0.1%")}>0.1%</SlippageSelect>
                <SlippageSelect active={slippage === "0.5%"} onClick={() => setSlippage("0.5%")}>0.5%</SlippageSelect>
                <SlippageSelect active={slippage === "1%"} onClick={() => setSlippage("1%")}>1%</SlippageSelect>
            </div>
            <Input suffix="%" placeholder="Custom" type="number" textClassName="text-sm" />
        </div>
    )
}

export default Setting;