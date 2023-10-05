import { memo, useMemo } from 'react'
import { PCSDuoTokenVaultConfig } from '@pancakeswap/position-managers'

import { usePCSVault } from '../hooks'
import { DuoTokenVaultCard } from '../components'

interface Props {
  config: PCSDuoTokenVaultConfig
}

export const PCSVaultCard = memo(function PCSVaultCard({ config }: Props) {
  const { vault } = usePCSVault({ config })
  const { id, currencyA, currencyB, name, strategy, feeTier, autoFarm, manager, managerFee } = vault
  const managerInfo = useMemo(
    () => ({
      id: manager.id,
      name: manager.name,
    }),
    [manager],
  )

  // console.log(vault)
  return (
    <DuoTokenVaultCard
      id={id}
      currencyA={currencyA}
      currencyB={currencyB}
      name={name}
      strategy={strategy}
      feeTier={feeTier}
      autoFarm={autoFarm}
      manager={managerInfo}
      managerFee={managerFee}
    >
      {id}
    </DuoTokenVaultCard>
  )
})
