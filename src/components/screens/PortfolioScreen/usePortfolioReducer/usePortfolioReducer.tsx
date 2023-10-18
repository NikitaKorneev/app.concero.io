import { Dispatch, useReducer } from 'react'
import { PortfolioAction, PortfolioActionTypes, PortfolioState } from './types'

function portfolioReducer(state: PortfolioState, action: PortfolioAction): PortfolioState {
	switch (action.type) {
		case PortfolioActionTypes.SET_BALANCES:
			return { ...state, balances: action.balances }
		default:
			return state
	}
}

const initialState: PortfolioState = {
	balances: [],
}

export function usePortfolioReducer(): [PortfolioState, Dispatch<PortfolioAction>] {
	const [portfolioState, portfolioDispatch] = useReducer(portfolioReducer, initialState)
	return [portfolioState, portfolioDispatch]
}
