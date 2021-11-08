import ListPoolItem from 'components/ListPoolItem';
import PoolCard from 'components/PoolCard';
import { ViewType } from 'components/PoolFilter';
import Token from 'components/Token';
import IPool from 'interface/pool';
import IToken from 'interface/token';
import styles from './ListPool.module.css'

interface Props {
    items: IPool[]
    className?: string | undefined
    view?: ViewType
}

const ListPool = (props: Props) => {
    return (
        <div className={`${props.className || ''} ${props.view == ViewType.Card ? styles.containerCard : styles.containerList}`}>
            {
                props.items.map((pool, i) => {
                    if (props.view == ViewType.Card) {
                        return <PoolCard key={pool.id} pool={pool} />
                    } else {
                        return <ListPoolItem key={pool.id} pool={pool} dark={i%2===0} />
                    }
                })
            }
        </div>
    )
}

export default ListPool;