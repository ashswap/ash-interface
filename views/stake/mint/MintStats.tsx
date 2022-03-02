import React from 'react'
import ICMinus from "assets/svg/minus.svg";
import ICPlus from "assets/svg/plus.svg";
import ImgUsdt from "assets/images/usdt-icon.png";
import Image from "next/image";

const LPStat = () => {
    return <div className='flex justify-between items-end'>
        <div>
            <div className='flex items-center mb-4'>
                <div className='rounded-full overflow-hidden w-4 h-4'>
                <Image src={ImgUsdt} alt="token icon" width={16} height={16}/>
                </div>
                <div className='rounded-full overflow-hidden w-4 h-4 -ml-1'>
                <Image src={ImgUsdt} alt="token icon" width={16} height={16}/>
                </div>
                <div className='text-stake-gray-500 text-sm font-bold ml-1.5'>LP-USDTUSDC</div>
            </div>
            <div className='text-lg'>
                <span className='text-stake-gray-500'>$&nbsp;</span>
                <span className='text-white font-bold'>351,691,291.01</span>
            </div>
        </div>
        <div className='flex space-x-2'>
            <button className='clip-corner-1 clip-corner-br bg-ash-dark-400 w-12 h-12 text-ash-purple-500 flex justify-center items-center'>
                <ICMinus/>
            </button>
            <button className='clip-corner-1 clip-corner-bl bg-ash-dark-400 w-12 h-12 text-stake-green-500 flex justify-center items-center'>
                <ICPlus/>
            </button>
        </div>
    </div>
}
function MintStats() {
  return (
    <div className='flex'>
        <div className='w-[21.875rem] flex-shrink-0 px-9 pb-9 pt-14 bg-stake-dark-400'>
            <h2 className='text-2xl font-bold text-white mb-11'>Your stats</h2>
            <div>
                <LPStat/>
            </div>
        </div>
    </div>
  )
}

export default MintStats