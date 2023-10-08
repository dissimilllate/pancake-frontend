import { Percent } from '@pancakeswap/sdk'
import { bscTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'

import { ManagerFeeType, Strategy, VaultConfig } from '../../types'
import { MANAGER } from '../managers'

export const vaults: VaultConfig[] = [
  {
    id: 1,
    name: 'ICHI',
    address: '0x7fcBe3DDc2e6BD069eb5f11374DCA99f00685189',
    adapterAddress: '0x7F9ECfe70996aE6b65f93EF831E6037B8381BeD7',
    lpAddress: '0x63652e66Abd23d02537759f03314c333921915E1',
    rewardPerSecond: '100000000000000',
    currencyA: bscTokens.cake,
    currencyB: bscTokens.usdt,
    earningToken: bscTokens.cake,
    feeTier: FeeAmount.MEDIUM,
    strategy: Strategy.YIELD_IQ,
    managerFee: {
      type: ManagerFeeType.LP_REWARDS,
      rate: new Percent(1, 100),
    },
    manager: MANAGER.ICHI,
    isSingleDepositToken: true,
    allowDepositToken0: true,
    allowDepositToken1: false,
    priceFromV3FarmPid: 3,
    managerInfoUrl: 'https://google.com/',
    strategyInfoUrl: 'https://google.com/',
    projectVaultUrl: 'https://google.com/',
  },
]
