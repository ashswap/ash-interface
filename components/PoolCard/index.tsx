import Token from 'components/Token';
import Panel, { PanelContent } from 'components/Panel'
import pools from 'const/pool';
import IPool from 'interface/pool';
import IToken from 'interface/token';
import Down from 'assets/svg/down-white.svg';
import styles from './PoolCard.module.css'
import Button from 'components/Button';
import { useState } from 'react';
import Modal from 'components/Modal';
import AddLiqModal from 'components/AddLiqModal';

interface Props {
    pool: IPool
    className?: string | undefined;
}

const PoolCard = (props: Props) => {
    const [isExpand, setIsExpand] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)

    return (
        <Panel className={`${props.className || ''}`} topRightCorner>
            <PanelContent className={`${styles.content}`}>
                <div className="flex flex-row justify-between items-center">
                    <div>
                        <div className="text-text-input-3 text-xs">Deposit</div>
                        <div className="flex flex-row items-baseline text-2xl font-bold">
                            <span>{props.pool.tokens[0].name}</span>
                            <span className="text-sm px-3">&</span>
                            <span>{props.pool.tokens[1].name}</span>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <div className={styles.tokenIcon} style={{backgroundColor: props.pool.tokens[0].icon}}></div>
                        <div className={styles.tokenIcon} style={{backgroundColor: props.pool.tokens[1].icon, marginLeft: "-10px"}}></div>
                    </div>
                </div>
                <div className="flex flex-row my-12 justify-between items-center">
                    <div>
                        <div className="text-text-input-3 text-xs mb-4">APR Earn</div>
                        <div className="text-yellow-600 font-bold text-lg">921%</div>
                    </div>
                    <div>
                        <div className="text-text-input-3 text-xs mb-4">Farming per day</div>
                        <div>
                            <span className="text-earn font-bold text-lg">0.52</span>
                            <span className="text-xs font-normal"> <span className="text-earn">CAKE</span> per 1,000 USDT</span>
                        </div>
                    </div>
                </div>
                <Button bottomRightCorner style={{height: 56}} textClassName="text-sm" onClick={() => setOpen(true)}>Deposit</Button>

                <div className="bg-bg my-4 text-text-input-3">
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className={styles.poolInfoLabel}>Total Liquidity</div>
                        <div className="text-sm">$512,913,133</div>
                    </div>
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className={styles.poolInfoLabel}>24H Volume</div>
                        <div className="text-sm">$12,913,133</div>
                    </div>
                    {
                        isExpand && (
                            <>
                                <div className="flex flex-row justify-between items-center p-4">
                                    <div className={styles.poolInfoLabel}>Performance Fee</div>
                                    <div className="text-sm">2%</div>
                                </div>
                                <div className="flex flex-row justify-between items-center p-4">
                                    <div className={styles.poolInfoLabel}>Trading APR</div>
                                    <div className="text-sm">32%</div>
                                </div>
                                <div className="flex flex-row justify-between items-center p-4">
                                    <div className={styles.poolInfoLabel}>Emissions APR</div>
                                    <div className="text-sm">51%</div>
                                </div>
                            </>
                        )
                    }
                </div>

                <div className="flex flex-row justify-center items-center select-none cursor-pointer py-2" onClick={() => setIsExpand(!isExpand)}>
                    <div className="font-bold text-sm mr-2">Detail</div>
                    <Down style={{transform: `rotate(${isExpand ? '180' : '0'}deg)`}} />
                </div>

                <AddLiqModal open={open} onClose={() => setOpen(false)} pool={props.pool} />
            </PanelContent>
        </Panel>
    )
}

export default PoolCard;