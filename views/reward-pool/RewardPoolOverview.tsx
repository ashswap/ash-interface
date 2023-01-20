import React from 'react'
import Header from './Header'
import PrizePool from './PrizePool'
import Timeline from './Timeline'

function RewardPoolOverview() {
  return (
    <div className='py-10'>
        <Header/>
        <PrizePool/>
        <Timeline/>
    </div>
  )
}

export default RewardPoolOverview