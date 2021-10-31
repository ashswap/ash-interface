import styles from './TokenSelect.module.css'
import Down from 'assets/svg/down.svg'

const TokenSelect = () => {
    return (
        <div className="flex flex-row items-center justify-between text-sm font-bold w-44 cursor-pointer select-none bg-bg-select p-4 rounded-xl text-pink-600">
            <div>Select a token</div>
            <Down />
        </div>
    )
}

export default TokenSelect;