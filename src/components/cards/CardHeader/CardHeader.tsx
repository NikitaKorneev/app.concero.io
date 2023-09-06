import { FC, ReactNode } from 'react'
import classNames from './CardHeader.module.pcss'

interface CardHeaderProps {
  title: string
  children?: ReactNode
}

export const CardHeader: FC<CardHeaderProps> = ({ title, children }) => (
  <div className={classNames.cardHeader}>
    <div className={classNames.titleContainer}>
      <h5>{title}</h5>
    </div>
    {children}
  </div>
)
