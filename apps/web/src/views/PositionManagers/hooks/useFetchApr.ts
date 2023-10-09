import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem'
import { useQuery } from '@tanstack/react-query'
import { POSITION_MANAGER_API } from 'config/constants/endpoints'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { SUPPORTED_CHAIN_IDS as POSITION_MANAGERS_SUPPORTED_CHAINS } from '@pancakeswap/position-managers'

export interface AprDataInfo {
  token0: number
  token1: number
  chainId: ChainId
  lpAddress: Address
  calculationDays: number
}

export interface AprData {
  data: AprDataInfo[]
  isLoading: boolean
  refetch: () => void
}

export const useFetchApr = (): AprData => {
  const { chainId } = useActiveChainId()
  const { data, isLoading, refetch } = useQuery(
    ['/fetch-position-manager-apr', chainId],
    async () => {
      try {
        const response = await fetch(`${POSITION_MANAGER_API}/${chainId}/vault/feeAvg`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            avgFeeCalculationDays: '7',
          }),
        })

        const result: AprDataInfo[] = await response.json()
        return result
      } catch (error) {
        console.log(`Fetch APR API: ${error}`)
        return []
      }
    },
    {
      enabled: !POSITION_MANAGERS_SUPPORTED_CHAINS[chainId],
      refetchOnWindowFocus: false,
    },
  )

  return { data, isLoading, refetch }
}
