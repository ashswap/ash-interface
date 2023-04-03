import BigNumber from 'bignumber.js'
import DonutChart, { DounutChartRecord } from 'components/Chart/DonutChart'
import { HEX_COLORS } from 'const/colors'
import { getHexColor } from 'helper/color'
import { shortenString } from 'helper/string'
import { memo, useMemo } from 'react'

type Props = {
    items?: string[][]
}
function DAOVoteChart({items = []}: Props) {
    const data: DounutChartRecord[] = useMemo(() => {
        return (items || []).map(([address, power], i) => {
            const record: DounutChartRecord = {
                id: address,
                name: shortenString(address),
                value: new BigNumber(power).div(1e18).toNumber(),
                theme: HEX_COLORS[i] ?? getHexColor(address)
            }
            return record;
        })
    }, [items]);
  return (
    <div className='grid grid-cols-2 items-center gap-7.5'>
        <div className='flex flex-col gap-y-4'>
            {data.map(r => {
                return <div key={r.id} className='flex items-center'>
                    <div className='w-4 h-4 mr-4 rounded-full' style={{backgroundColor: r.theme}}></div>
                    <div className='font-bold text-xs text-white'>{r.name}</div>
                </div>
            })}
        </div>
        <DonutChart data={data} radius={130}/>
    </div>
  )
}

export default memo(DAOVoteChart)