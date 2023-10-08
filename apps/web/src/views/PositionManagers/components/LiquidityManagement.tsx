import { memo, useCallback, useMemo, useState } from 'react'
import { Button } from '@pancakeswap/uikit'
import { Address } from 'viem'
import { MANAGER, BaseAssets } from '@pancakeswap/position-managers'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Percent, Price } from '@pancakeswap/sdk'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { useCurrencyBalances } from 'state/wallet/hooks'

import ConnectWalletButton from 'components/ConnectWalletButton'
import { useAccount } from 'wagmi'
import { CardSection } from './CardSection'
import { AddLiquidity } from './AddLiquidity'
import { InnerCard } from './InnerCard'
import { StakedAssets } from './StakedAssets'
import { RewardAssets } from './RewardAssets'
import { RemoveLiquidity } from './RemoveLiquidity'
import { AprDataInfo } from '../hooks'

interface Props {
  manager: {
    id: MANAGER
    name: string
  }
  currencyA: Currency
  currencyB: Currency
  earningToken: Currency
  staked0Amount?: CurrencyAmount<Currency>
  staked1Amount?: CurrencyAmount<Currency>
  vaultName: string
  feeTier: FeeAmount
  price?: Price<Currency, Currency>
  ratio: number
  isSingleDepositToken: boolean
  allowDepositToken0: boolean
  allowDepositToken1: boolean
  contractAddress: Address
  token0PriceUSD?: number
  token1PriceUSD?: number
  pendingReward: bigint | undefined
  userVaultPercentage?: Percent
  poolToken0Amount?: bigint
  poolToken1Amount?: bigint
  rewardPerSecond: string
  aprDataInfo: {
    info: AprDataInfo | undefined
    isLoading: boolean
  }
  refetch?: () => void
  // TODO: replace with needed returned information
  onAddLiquidity?: (amounts: CurrencyAmount<Currency>[]) => Promise<void>

  // TODO: replace with needed returned information
  onRemoveLiquidity?: (params: { assets: BaseAssets; percentage: Percent }) => Promise<void>
}

export const LiquidityManagement = memo(function LiquidityManagement({
  manager,
  currencyA,
  currencyB,
  earningToken,
  vaultName,
  feeTier,
  price,
  ratio,
  isSingleDepositToken,
  allowDepositToken0,
  allowDepositToken1,
  contractAddress,
  staked0Amount,
  staked1Amount,
  token0PriceUSD,
  token1PriceUSD,
  pendingReward,
  userVaultPercentage,
  poolToken0Amount,
  poolToken1Amount,
  rewardPerSecond,
  aprDataInfo,
  refetch,
}: Props) {
  const { t } = useTranslation()
  const [addLiquidityModalOpen, setAddLiquidityModalOpen] = useState(false)
  const [removeLiquidityModalOpen, setRemoveLiquidityModalOpen] = useState(false)
  const hasStaked = useMemo(() => Boolean(staked0Amount) || Boolean(staked1Amount), [staked0Amount, staked1Amount])
  const { address: account } = useAccount()
  const showAddLiquidityModal = useCallback(() => setAddLiquidityModalOpen(true), [])
  const hideAddLiquidityModal = useCallback(() => setAddLiquidityModalOpen(false), [])

  const showRemoveLiquidityModal = useCallback(() => setRemoveLiquidityModalOpen(true), [])
  const hideRemoveLiquidityModal = useCallback(() => setRemoveLiquidityModalOpen(false), [])

  const relevantTokenBalances = useCurrencyBalances(
    account ?? undefined,
    useMemo(() => [currencyA ?? undefined, currencyB ?? undefined], [currencyA, currencyB]),
  )
  const userCurrencyBalances = {
    token0Balance: relevantTokenBalances[0],
    token1Balance: relevantTokenBalances[1],
  }

  return (
    <>
      {hasStaked ? (
        <>
          <InnerCard>
            <StakedAssets
              currencyA={currencyA}
              currencyB={currencyB}
              staked0Amount={staked0Amount}
              staked1Amount={staked1Amount}
              price={price}
              onAdd={showAddLiquidityModal}
              onRemove={showRemoveLiquidityModal}
              token0PriceUSD={token0PriceUSD}
              token1PriceUSD={token1PriceUSD}
            />
          </InnerCard>
          <RewardAssets
            contractAddress={contractAddress}
            pendingReward={pendingReward}
            earningToken={earningToken}
            refetch={refetch}
          />
        </>
      ) : !account ? (
        <ConnectWalletButton mt="24px" width="100%" />
      ) : (
        <CardSection title={t('Start earning')}>
          <Button variant="primary" width="100%" onClick={showAddLiquidityModal}>
            {t('Add Liquidity')}
          </Button>
        </CardSection>
      )}
      <AddLiquidity
        manager={manager}
        vaultName={vaultName}
        feeTier={feeTier}
        isOpen={addLiquidityModalOpen}
        onDismiss={hideAddLiquidityModal}
        currencyA={currencyA}
        currencyB={currencyB}
        ratio={ratio}
        earningToken={earningToken}
        isSingleDepositToken={isSingleDepositToken}
        allowDepositToken0={allowDepositToken0}
        allowDepositToken1={allowDepositToken1}
        contractAddress={contractAddress}
        userCurrencyBalances={userCurrencyBalances}
        userVaultPercentage={userVaultPercentage}
        poolToken0Amount={poolToken0Amount}
        poolToken1Amount={poolToken1Amount}
        token0PriceUSD={token0PriceUSD}
        token1PriceUSD={token1PriceUSD}
        rewardPerSecond={rewardPerSecond}
        aprDataInfo={aprDataInfo}
        refetch={refetch}
      />
      <RemoveLiquidity
        isOpen={removeLiquidityModalOpen}
        onDismiss={hideRemoveLiquidityModal}
        vaultName={vaultName}
        feeTier={feeTier}
        currencyA={currencyA}
        currencyB={currencyB}
        staked0Amount={staked0Amount}
        staked1Amount={staked1Amount}
        token0PriceUSD={token0PriceUSD}
        token1PriceUSD={token1PriceUSD}
        contractAddress={contractAddress}
        refetch={refetch}
      />
    </>
  )
})
