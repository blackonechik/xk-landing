import type { AdminApplicationRow, AdminPromoCodeRow } from './api'
import type { SiteNavigationRole } from '@/entities/site'

const paymentStatusMeta: Record<
  string,
  {
    label: string
    color: 'success' | 'warning' | 'danger' | 'default' | 'accent'
  }
> = {
  paid: { label: 'Оплачено', color: 'success' },
  pending: { label: 'Ожидает оплату', color: 'warning' },
  failed: { label: 'Ошибка оплаты', color: 'danger' },
  canceled: { label: 'Отменено', color: 'default' },
}

const applicationStatusMeta: Record<
  string,
  {
    label: string
    color: 'success' | 'warning' | 'danger' | 'default' | 'accent'
  }
> = {
  new: { label: 'Новая', color: 'accent' },
  review: { label: 'На рассмотрении', color: 'warning' },
  accepted: { label: 'Принята', color: 'success' },
  rejected: { label: 'Отклонена', color: 'danger' },
}

const postModerationStatusMeta: Record<
  string,
  {
    label: string
    color: 'success' | 'warning' | 'danger' | 'default' | 'accent'
  }
> = {
  pending: { label: 'На модерации', color: 'warning' },
  approved: { label: 'Одобрен', color: 'success' },
  rejected: { label: 'Отклонен', color: 'danger' },
}

const promoStatusMeta = {
  active: { label: 'Активен', color: 'success' as const },
  disabled: { label: 'Выключен', color: 'default' as const },
}

export function getPaymentStatusMeta(status: string) {
  return (
    paymentStatusMeta[status] ?? { label: status, color: 'default' as const }
  )
}

export function getApplicationStatusMeta(
  status: AdminApplicationRow['status'],
) {
  return (
    applicationStatusMeta[status] ?? {
      label: status,
      color: 'default' as const,
    }
  )
}

export function getPostModerationStatusMeta(status: string) {
  return (
    postModerationStatusMeta[status] ?? {
      label: status,
      color: 'default' as const,
    }
  )
}

export function getPromoStatusMeta(isActive: AdminPromoCodeRow['isActive']) {
  return isActive ? promoStatusMeta.active : promoStatusMeta.disabled
}

export const navigationRoleOptions: {
  value: SiteNavigationRole
  label: string
}[] = [
  { value: 'player', label: 'Игроки' },
  { value: 'moderator', label: 'Модераторы' },
  { value: 'admin', label: 'Админы' },
]

export const playerRoleOptions = [
  { value: 'player', label: 'Игрок' },
  { value: 'moderator', label: 'Модератор' },
  { value: 'admin', label: 'Админ' },
]
