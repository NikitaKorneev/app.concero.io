import { useContext, useEffect, useRef } from 'react'
import { Modal } from '../../../modals/Modal/Modal'
import { StakingState } from '../../../screens/StakingScreen/stakingReducer/types'
import classNames from './ManageModal.module.pcss'
import { SelectArea } from './SelectArea/SelectArea'
import { useManageReducer } from './useManageReducer/useManageReducer'
import { ModalType, SwapType } from './constants'
import { InnerSelectModal } from './InnerSelectModal/InnerSelectModal'
import { ListEntityButton } from '../../../buttons/ListEntityButton/ListEntityButton'
import { DataContext } from '../../../../hooks/DataContext/DataContext'
import { Button } from '../../../buttons/Button/Button'
import { Details } from './Details/Details'
import { StakeButton } from '../StakeButton/StakeButton'
import { getQuote } from './getQuote'
import { getBalance } from '../../../../utils/getBalance'
import { addingTokenDecimals } from '../../../../utils/formatting'

interface ManageModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  stakingState: StakingState
}

export function ManageModal({ isOpen, setIsOpen, stakingState }: ManageModalProps) {
  const { getChains, getTokens } = useContext(DataContext)
  const [manageState, manageDispatch] = useManageReducer(stakingState)
  const { modalType, swapType } = manageState
  const typingTimeoutRef = useRef(null)

  async function handleSelectChain(item: any) {
    const direction = swapType === SwapType.stake ? 'from' : 'to'
    const tokens = await getTokens({ chainId: item.id, offset: 0, limit: 15 })
    manageDispatch({ type: 'SET_CHAIN', payload: item, tokens, direction })
    manageDispatch({ type: 'SET_MODAL_TYPE', payload: ModalType.input })
  }

  function handleSelectToken(item: any) {
    const direction = swapType === SwapType.stake ? 'from' : 'to'
    manageDispatch({ type: 'SET_TOKEN', payload: item, direction })
    manageDispatch({ type: 'SET_MODAL_TYPE', payload: ModalType.input })
  }

  function handleOnClose() {
    manageDispatch({ type: 'RESET', payload: stakingState })
    setIsOpen(false)
  }

  async function setWithdrawType() {
    if (manageState.swapType === SwapType.withdraw) return
    const tokens = await getTokens({ chainId: manageState.to.chain.id, offset: 0, limit: 15 })
    manageDispatch({ type: 'SET_WITHDRAW_TYPE', token: tokens[0] })
  }

  function setStakeType() {
    if (manageState.swapType === SwapType.stake) return
    manageDispatch({ type: 'SET_STAKE_TYPE' })
  }

  useEffect(() => {
    getQuote({ manageState, manageDispatch, typingTimeoutRef })
  }, [manageState.from.amount, manageState.from.chain.id, manageState.to.chain.id, manageState.from.token.address, manageState.to.token.address])

  useEffect(() => {
    if (swapType == SwapType.stake) {
      getBalance({ dispatch: manageDispatch, from: manageState.from, address: manageState.address })
    } else {
      const balanceAmount = stakingState?.selectedVault?.stakedAmount
        ? addingTokenDecimals(stakingState.selectedVault.stakedAmount, stakingState.selectedVault.decimals)
        : null
      manageDispatch({ type: 'SET_BALANCE', payload: balanceAmount })
    }
  }, [manageState.from.chain.id, manageState.from.token.address, manageState.from.token.symbol])

  useEffect(() => {
    manageDispatch({ type: 'SET_TO_SELECTION', payload: stakingState.selectedVault })
  }, [stakingState.selectedVault])

  return (
    <Modal title="Manage position" show={isOpen} setShow={handleOnClose}>
      <div className={classNames.container}>
        {modalType === ModalType.input ? (
          <div className={classNames.areaContainer}>
            <div className={classNames.row}>
              <Button size="sm" variant={swapType === SwapType.stake ? 'primary' : 'subtle'} onClick={setStakeType}>
                Stake
              </Button>
              <Button size="sm" variant={swapType === SwapType.withdraw ? 'primary' : 'subtle'} onClick={setWithdrawType}>
                Withdraw
              </Button>
            </div>
            <SelectArea selection={manageState.from} direction="from" dispatch={manageDispatch} swapType={swapType} balance={manageState.balance} />
            <SelectArea selection={manageState.to} direction="to" dispatch={manageDispatch} swapType={swapType} />
            <Details manageState={manageState} />
            <StakeButton manageState={manageState} manageDispatch={manageDispatch} />
          </div>
        ) : modalType === ModalType.chains ? (
          <InnerSelectModal RenderItem={ListEntityButton} getItems={getChains} onSelect={handleSelectChain} />
        ) : (
          <InnerSelectModal RenderItem={ListEntityButton} getItems={getTokens} onSelect={handleSelectToken} chainId={manageState.from.chain.id} />
        )}
      </div>
    </Modal>
  )
}
