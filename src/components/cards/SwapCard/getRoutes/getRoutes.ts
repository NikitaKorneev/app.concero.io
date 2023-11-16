import { fetchRangoRoutes } from '../../../../api/rango/fetchRangoRoutes'
import { fetchLifiRoutes } from '../../../../api/lifi/fetchLifiRoutes'
import { StandardRoute } from '../../../../types/StandardRoute'
import { Settings, SwapAction, SwapStateDirection } from '../swapReducer/types'
import { Dispatch } from 'react'
import { GetLifiRoutes, GetRangoRoutes, PopulateRoutes } from './types'
import { fetchWalletBalancesOnStepChains } from './fetchWalletBalancesOnStepChains'
import { trackEvent } from '../../../../hooks/useTracking'
import { action, category } from '../../../../constants/tracking'
import { fetchOkxRoutes } from '../../../../api/okx/fetchOkxRoutes'

const populateRoutes = ({ routes, from, swapDispatch }: PopulateRoutes) => {
	swapDispatch({
		type: 'POPULATE_ROUTES',
		payload: routes,
		fromAmount: from.amount,
	})
}

const getLifiRoutes = async ({ routes, from, to, settings, swapDispatch }: GetLifiRoutes): Promise<void> => {
	try {
		const lifiRoutes: StandardRoute[] | [] = await fetchLifiRoutes({ from, to, settings })
		routes.unshift(...lifiRoutes)
		populateRoutes({ routes, from, swapDispatch })
	} catch (error) {
		trackEvent({ category: category.SwapCard, action: action.FetchLifiRoutesError, label: 'fetch_lifi_routes_error', data: { error } })
		console.error(error)
	}
}

const getRangoRoutes = async ({ routes, from, to, settings, swapDispatch }: GetRangoRoutes): Promise<void> => {
	try {
		const rangoRoutes: StandardRoute[] = await fetchRangoRoutes({ from, to, settings })
		routes.push(...rangoRoutes)
		populateRoutes({ routes, from, swapDispatch })
	} catch (error) {
		trackEvent({ category: category.SwapCard, action: action.FetchRangoRoutesError, label: 'fetch_rango_routes_error', data: { error } })
		console.error('rangoRoutes', error)
	}
}

async function getOkxRoutes({ routes, from, to, settings, swapDispatch }: GetRangoRoutes): Promise<void> {
	try {
		const okxRoutes = await fetchOkxRoutes(from, to, settings)
		console.log('okxRoutes', okxRoutes)
		routes.push(...okxRoutes)
		populateRoutes({ routes, from, swapDispatch })
	} catch (error) {
		trackEvent({ category: category.SwapCard, action: action.FetchOkxRoutesError, label: 'fetch_okx_routes_error', data: { error } })
		console.error('okxRoutes', error)
	}
}

export const getRoutes = async (from: SwapStateDirection, to: SwapStateDirection, settings: Settings, swapDispatch: Dispatch<SwapAction>): Promise<void> => {
	if (!from.amount || !parseFloat(from.amount)) return
	swapDispatch({ type: 'SET_LOADING', payload: true })
	const routes: StandardRoute[] | [] = []

	try {
		await Promise.all([
			// getLifiRoutes({ routes, from, to, settings, swapDispatch }),
			// getRangoRoutes({ routes, from, to, settings, swapDispatch }),
			getOkxRoutes({ routes, from, to, settings, swapDispatch }),
		])
		await fetchWalletBalancesOnStepChains(routes, swapDispatch, from.address)
	} catch (error) {
		console.error(error)
	} finally {
		swapDispatch({ type: 'SET_LOADING', payload: false })
	}
}
