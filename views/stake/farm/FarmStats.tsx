import React from 'react'

function FarmStats() {
  return (
    <div className="flex flex-col md:flex-row">
        <div className="md:w-[21.875rem] flex-shrink-0 flex flex-col px-7 lg:px-9 pb-9 pt-7 lg:pt-14 bg-stake-dark-400 mb-4 md:mb-0 md:mr-[1.875rem]">
            <div className='flex justify-between items-center mb-9'>

            <h2 className='text-2xl font-bold text-white'>Your Summary</h2>
            <span className='text-ash-cyan-500 text-lg font-bold'>All</span>
            </div>
            <div className='bg-ash-dark-400/30 py-5 px-4.5'>
                <div className='px-5 py-2 mb-5'>
                    <div className='text-ash-gray-500 text-sm font-bold underline mb-6'>TOTAL FARM REWARD</div>
                    <div className='flex items-center'>
                        <div className='w-4.5 h-4.5 rounded-full bg-pink-600 mr-2'></div>
                        <div className='text-white text-lg font-bold'>4.00 ASH</div>
                    </div>
                </div>
                <button className='text-ash-dark-400 bg-ash-cyan-500 w-full h-[3.375rem] text-sm font-bold flex items-center justify-center'>Harvest</button>
            </div>
        </div>
        <div className="flex-grow px-7 lg:px-16 pt-7 lg:pt-14 pb-9 bg-stake-dark-400">
            <h2 className='text-2xl font-bold text-white mb-9'>Overall stats</h2>
            <div className='flex items-end'>
                <div className='bg-ash-dark-400/30 px-9 py-7 flex-1 mr-7.5'>
                    <div className='text-ash-gray-500 text-sm font-bold mb-6'>TOTAL VALUE OF LOCKED LP</div>
                    <div className='text-lg'>
                        <span className='text-ash-gray-500'>$ </span>
                        <span className='text-white font-bold'>51,691,291.012512</span>
                    </div>
                </div>
                <div className='flex-1 text-ash-gray-500'>
                    <div className='text-sm font-bold mb-4'>TIPS</div>
                    <div className='text-sm'>
                    Stake <span className='text-white font-bold'>LP-Tokens</span> to earn ASH. Just lie on the bed & watch it growing!
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FarmStats