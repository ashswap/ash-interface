import styles from './Swap.module.css'
import Link from 'next/link'
import Fire from 'assets/images/fire.png'
import Image from 'next/image'
import IconButton from 'components/IconButton'
import Clock from 'assets/svg/clock.svg'
import Setting from 'assets/svg/setting.svg'

const Swap = () => {
    return (
        <div className="flex flex-col items-center pt-3.5">
            <div className={styles.border}>
                <div className={styles.fire}>
                    <Image src={Fire} width={151} height={230} />
                </div>
                <div className="bg-ash-dark h-96 text-white px-12 py-7">
                    <div className="flex flex-row justify-between">
                        <div className="font-bold text-2xl">Swap</div>
                        <div className="flex flex-row gap-2">
                            <IconButton icon={<Clock />} />
                            <IconButton icon={<Setting />} />
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Swap;