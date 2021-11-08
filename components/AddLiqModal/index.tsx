import Button from 'components/Button';
import Checkbox from 'components/Checkbox';
import Input from 'components/Input';
import Modal from 'components/Modal';
import PoolCard from 'components/PoolCard';
import Token from 'components/Token';
import IPool from 'interface/pool';
import IToken from 'interface/token';
import { useEffect, useState } from 'react';
import styles from './AddLiqModal.module.css'

interface Props {
    open?: boolean
    onClose?: () => void
    pool: IPool
}

const AddLiqModal = (props: Props) => {
    const [isAgree, setAgree] = useState<boolean>(false)

    // reset when open modal
    useEffect(() => {
        if (props.open) {
            setAgree(false)
        }
    }, [props.open])

    return (
        <Modal open={props.open} onClose={props.onClose} contentClassName={styles.content} dark="600">
            <div className="flex flex-row justify-between items-center w-1/3">
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
            <div className="flex flex-row my-10 gap-8">
                <div className="relative w-2/3">
                    <div className="my-1.5">
                        <div className="flex flex-row">
                            <Token token={props.pool.tokens[0]} className="w-1/3" />
                            <Input
                                className="flex-1"
                                backgroundClassName="bg-ash-dark-700"
                                textColorClassName="text-input-3"
                                placeholder="0"
                                type="number"
                                textAlign='right'
                                textClassName='text-lg'
                            />
                        </div>
                        <div className="bg-bg py-2 text-sm text-text-input-3 text-right">
                            <span>Balance: </span>
                            <span className="text-earn">341.311 {props.pool.tokens[0].name}</span>
                        </div>
                    </div>

                    <div className="my-1.5">
                        <div className="flex flex-row">
                            <Token token={props.pool.tokens[1]} className="w-1/3" />
                            <Input
                                className="flex-1"
                                backgroundClassName="bg-ash-dark-700"
                                textColorClassName="text-input-3"
                                placeholder="0"
                                type="number"
                                textAlign='right'
                                textClassName='text-lg'
                            />
                        </div>
                        <div className="bg-bg py-2 text-sm text-text-input-3 text-right">
                            <span>Balance: </span>
                            <span className="text-earn">341.311 {props.pool.tokens[1].name}</span>
                        </div>
                    </div>

                    <div className="absolute left-0 ml-2" style={{top: 62}}>&</div>
                </div>
                <div className="w-1/3 bg-ash-dark-500 p-8">
                    <div className="text-lg font-bold text-center">Estimate Earning</div>
                    <div className="flex flex-row flex-wrap text-xs my-8 gap-y-9">
                        <div className="w-1/2">
                            <div className="mb-4">APR</div>
                            <div>-</div>
                        </div>
                        <div className="w-1/2">
                            <div className="mb-4">Your Capacity</div>
                            <div>-</div>
                        </div>
                        <div className="w-full">
                            <div className="mb-4">Farm per day</div>
                            <div>- ELGD</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-row gap-8">
                <Checkbox className="w-2/3" checked={isAgree} onChange={setAgree} text={
                    <span>I verify that I have read the <b><u>AshSwap Pools Guide</u></b> and understand the risks of providing liquidity, including impermanent loss.</span>
                } />
                <div className="w-1/3">
                    <Button
                        topLeftCorner
                        style={{height: 48}}
                        className="mt-1.5"
                        outline
                        disable={!isAgree}
                    >DEPOSIT</Button>
                </div>
            </div>
        </Modal>
    )
}

export default AddLiqModal;