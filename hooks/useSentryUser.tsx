import { useGetAccountInfo } from '@elrondnetwork/dapp-core'
import * as Sentry from '@sentry/react'
import { useEffect } from 'react'

function useSentryUser() {
  const { address } = useGetAccountInfo()
  useEffect(() => {
    if (address) {
      Sentry.setUser({ account: address })
    }
  }, [address])
}

export default useSentryUser