import IToken from "interface/token";

interface Props {
    token: IToken
}

const Token = ({token: {name, icon}}: Props) => {
    return (
        <div className="flex flex-row items-center">
            <div style={{backgroundColor: icon}} className="w-5 h-5 rounded-full m-2"/>
            <div className="text-sm font-bold text-white">{name}</div>
        </div>
    )
}

export default Token;