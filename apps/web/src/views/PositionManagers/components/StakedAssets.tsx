import { memo, useMemo } from 'react'
import { Button, Text, RowBetween, Row, Flex, MinusIcon, AddIcon, CurrencyLogo } from '@pancakeswap/uikit'
import type { AtomBoxProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { Currency, CurrencyAmount, Price } from '@pancakeswap/sdk'
import { styled } from 'styled-components'

const Title = styled(Text).attrs({
  bold: true,
  fontSize: '12px',
  textTransform: 'uppercase',
})``

const ActionButton = styled(Button)`
  padding: 0.75em;
`

interface StakedAssetsProps {
  currencyA: Currency
  currencyB: Currency
  staked0Amount?: CurrencyAmount<Currency>
  staked1Amount?: CurrencyAmount<Currency>
  token0PriceUSD?: number
  token1PriceUSD?: number
  price?: Price<Currency, Currency>
  onAdd?: () => void
  onRemove?: () => void
}

export const StakedAssets = memo(function StakedAssets({
  currencyA,
  currencyB,
  onAdd,
  onRemove,
  staked0Amount,
  staked1Amount,
  token0PriceUSD,
  token1PriceUSD,
}: StakedAssetsProps) {
  const { t } = useTranslation()

  const totalAssetsInUsd = useMemo(() => {
    return (
      Number(formatAmount(staked0Amount)) * (token0PriceUSD ?? 0) +
      Number(formatAmount(staked1Amount)) * (token1PriceUSD ?? 0)
    )
  }, [staked0Amount, staked1Amount, token0PriceUSD, token1PriceUSD])

  return (
    <>
      <RowBetween>
        <Flex flexDirection="column">
          <Row>
            <Title color="secondary">{t('Liquidity')}</Title>
            <Title ml="0.25em" color="textSubtle">
              {t('Staked')}
            </Title>
          </Row>
          <Text color="text" fontSize="1.5em" bold>
            ~${totalAssetsInUsd.toFixed(2)}
          </Text>
        </Flex>
        <Flex flexDirection="row" justifyContent="flex-end">
          <ActionButton scale="md" onClick={onRemove}>
            <MinusIcon color="currentColor" width="1.5em" />
          </ActionButton>
          <ActionButton scale="md" ml="0.5em" onClick={onAdd}>
            <AddIcon color="currentColor" width="1.5em" />
          </ActionButton>
        </Flex>
      </RowBetween>
      <Flex flexDirection="column" mt="1em">
        <CurrencyAmountDisplay amount={staked0Amount} currency={currencyA} priceUSD={token0PriceUSD} />
        <CurrencyAmountDisplay amount={staked1Amount} mt="8px" currency={currencyB} priceUSD={token1PriceUSD} />
      </Flex>
    </>
  )
})

interface CurrencyAmountDisplayProps extends AtomBoxProps {
  amount?: CurrencyAmount<Currency>
  currency: Currency
  priceUSD?: number
}

export const CurrencyAmountDisplay = memo(function CurrencyAmountDisplay({
  amount,
  currency,
  priceUSD,
  ...rest
}: CurrencyAmountDisplayProps) {
  const currencyDisplay = amount?.currency || currency
  const amountDisplay = useMemo(() => formatAmount(amount) || '0', [amount])

  const amountInUsd = useMemo(() => {
    return Number(formatAmount(amount)) * (priceUSD ?? 0)
  }, [amount, priceUSD])

  return (
    <RowBetween {...rest}>
      <Flex flexDirection="row" justifyContent="flex-start">
        <CurrencyLogo currency={currencyDisplay} />
        <Text color="textSubtle" ml="0.5em">
          {currencyDisplay.symbol}
        </Text>
      </Flex>
      <Flex flexDirection="column" alignItems="flex-end">
        <Text color="text">{amountDisplay}</Text>
        <Text color="textSubtle" fontSize="0.75em">
          (~${amountInUsd.toFixed(2)})
        </Text>
      </Flex>
    </RowBetween>
  )
})
