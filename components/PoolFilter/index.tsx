import Select from 'components/Select'
import IconButton from 'components/IconButton'
import Input from 'components/Input'
import Card from 'assets/svg/card.svg'
import CardGrey from 'assets/svg/card-grey.svg'
import List from 'assets/svg/list.svg'
import ListGrey from 'assets/svg/list-grey.svg'
import Search from 'assets/svg/search.svg';

export enum ViewType {
    Card,
    List
}

interface Props {
    view?: ViewType
    onChangeView: (view: ViewType) => void
    className?: string | undefined;
}
const PoolFilter = (props: Props) => {
    const options = [
        { value: '0', label: 'APR' },
        { value: '1', label: 'Liquidity' },
        { value: '2', label: '24h Volume' }
    ]

    return (
        <div className={`flex flex-row justify-between mt-3.5 ${props.className}`}>
            <div className="flex flex-row justify-center items-center">
                <IconButton
                    icon={<CardGrey/>}
                    activeIcon={<Card/>}
                    active={props.view == ViewType.Card}
                    className="mr-2"
                    onClick={() => props.onChangeView(ViewType.Card)}
                />
                <IconButton
                    icon={<ListGrey/>}
                    activeIcon={<List/>}
                    active={props.view == ViewType.List}
                    className="mr-8"
                    onClick={() => props.onChangeView(ViewType.List)}
                />
                <Input
                    className="flex-1 w-80"
                    backgroundClassName="bg-ash-dark-700"
                    textColorClassName="text-input-3"
                    placeholder="Search pool"
                    type="number"
                    textAlign='left'
                    textClassName='font-normal text-sm'
                    suffix={<Search />}
                />
            </div>
            <div>
                <Select
                    prefix="Sort by"
                    options={options}
                />
            </div>
        </div>
    )
}

export default PoolFilter;