import {ReactElement} from 'react'
import buttonStyle from './Button.module.css'

interface Props {
    children?: string
    leftIcon?: ReactElement
}

const Button = (props: Props) => {
    return (
        <div className={buttonStyle.border}>
            <div className="flex flex-row justify-center gap-2 bg-pink-600 px-4 py-1.5 cursor-pointer select-none text-white font-medium text-xs leading-5">
                {props.leftIcon}
                {props.children}
            </div>
        </div>
    )
}

export default Button;