export interface PortfolioState {
	balances: any
}

export enum PortfolioActionTypes {
	SET_BALANCES = 1,
}

export type PortfolioAction = { type: PortfolioActionTypes.SET_BALANCES; balances: any }
