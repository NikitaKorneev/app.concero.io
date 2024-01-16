import { CardHeader } from '../CardHeader/CardHeader'
import { useTranslation } from 'react-i18next'
import { type ReferralAccountInfo, type ReferralReward } from '../../../api/concero/types'
import { RechartsBarChart } from '../../layout/RechartsBarChart/RechartsBarChart'
import { colors } from '../../../constants/colors'
import { addingTokenDecimals } from '../../../utils/formatting'
import { EmptyCard } from '../EmptyCard/EmptyCard'
import chart from '../../../assets/images/referral/chart.png'

const barColors = [
	colors.green.dark,
	colors.primary.mainLight,
	colors.grey.medium,
	colors.green.dark,
	colors.primary.mainLight,
	colors.grey.medium,
	colors.green.dark,
	colors.primary.mainLight,
	colors.grey.medium,
]

interface EarningBreakDownCardProps {
	referralStateData: ReferralAccountInfo | null
}

export function EarningBreakDownCard({ referralStateData }: EarningBreakDownCardProps) {
	const { t } = useTranslation()
	const data = referralStateData?.rewards?.map((reward: ReferralReward) => {
		return {
			name: reward.symbol,
			amount: Number(addingTokenDecimals(reward.reservedAmount, reward.decimals)),
		}
	})

	if (data?.length) {
		return (
			<div className={`card`}>
				<CardHeader title={t('earningsBreakDownCard.title')} />
				{data ? <RechartsBarChart data={data} barColors={barColors} /> : null}
			</div>
		)
	} else {
		return <EmptyCard srcImg={chart} title={t('referral.noRewardsTimeline')} />
	}
}
