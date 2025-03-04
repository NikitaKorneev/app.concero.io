import { type SwapState } from '../../cards/SwapCard/swapReducer/types'
import { ButtonType } from './constants'
import BigNumber from 'bignumber.js'

export function getButtonType(swapState: SwapState, isConnected: boolean): ButtonType {
	const { from, to, routes, isLoading, balance, isNoRoutes, selectedRoute } = swapState

	if (isLoading) {
		return ButtonType.LOADING
	}

	if (isNoRoutes) {
		return ButtonType.NO_ROUTES
	}

	if (!isConnected) {
		return ButtonType.CONNECT_WALLET
	}

	if (!from.amount || (from.amount && routes.length === 0)) {
		return ButtonType.ENTER_AMOUNT
	}

	if (balance && new BigNumber(from.amount).gt(balance.amount.formatted)) {
		return ButtonType.LOW_BALANCE
	}

	// const feeSufficiency = checkFeeSufficiency(swapState)

	if (from.amount && to.amount && routes.length > 0) {
		return ButtonType.SWAP
	}

	return ButtonType.ENTER_AMOUNT
}
