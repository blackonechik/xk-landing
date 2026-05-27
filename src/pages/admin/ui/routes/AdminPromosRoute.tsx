import { useState } from 'react'
import { AdminConfirmationDialog } from '../components/AdminConfirmationDialog'
import { PromosSection } from '../sections/PromosSection'
import { createPromoCode, updatePromoCode } from '../../model/api'
import { parseOptionalPositiveInt } from '../../lib/admin-format'
import type { ConfirmationState } from '../../model/types'
import { useAdminPageContext } from '../../model/admin-page-context'
import type { AdminPromoCodeRow } from '../../model/api'

export function AdminPromosRoute() {
  const {
    isSessionAdmin,
    promoCodes,
    setPromoCodes,
    showErrorToast,
    showInfoToast,
    showSuccessToast,
  } = useAdminPageContext()
  const [confirmState, setConfirmState] = useState<ConfirmationState>(null)
  const [isSavingPromo, setIsSavingPromo] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>(
    'percent',
  )
  const [discountValue, setDiscountValue] = useState('10')
  const [maxUses, setMaxUses] = useState('')
  const [maxUsesPerNickname, setMaxUsesPerNickname] = useState('1')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')

  function requestConfirmation(nextState: ConfirmationState) {
    setConfirmState(nextState)
  }

  async function handleCreatePromo() {
    if (!isSessionAdmin) {
      showErrorToast(
        'Доступ запрещен',
        'Нужен вход под пользователем с ролью администратора сайта.',
      )
      return
    }

    const normalizedCode = promoCode.trim().toUpperCase()

    if (!normalizedCode) {
      showInfoToast('Введите код промокода')
      return
    }

    const parsedDiscountValue = parseOptionalPositiveInt(discountValue)
    if (!parsedDiscountValue) {
      showInfoToast('Значение скидки должно быть целым числом больше 0')
      return
    }

    const parsedMaxUses = parseOptionalPositiveInt(maxUses)
    if (maxUses.trim() && !parsedMaxUses) {
      showInfoToast('Лимит использований должен быть целым числом больше 0')
      return
    }

    const parsedMaxUsesPerNickname =
      parseOptionalPositiveInt(maxUsesPerNickname)
    if (maxUsesPerNickname.trim() && !parsedMaxUsesPerNickname) {
      showInfoToast('Лимит на ник должен быть целым числом больше 0')
      return
    }

    setIsSavingPromo(true)

    try {
      const promo = await createPromoCode({
        code: normalizedCode,
        discountType,
        discountValue: parsedDiscountValue,
        maxUses: parsedMaxUses,
        maxUsesPerNickname: parsedMaxUsesPerNickname,
        startsAt: startsAt ? new Date(startsAt).toISOString() : undefined,
        endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
      })

      setPromoCodes((prev) => [promo, ...prev])
      setPromoCode('')
      setDiscountType('percent')
      setDiscountValue('10')
      setMaxUses('')
      setMaxUsesPerNickname('1')
      setStartsAt('')
      setEndsAt('')
      showSuccessToast(
        'Промокод создан',
        `Код ${promo.code} добавлен в систему.`,
      )
    } catch (requestError) {
      showErrorToast(
        'Не удалось создать промокод',
        requestError instanceof Error ? requestError.message : undefined,
      )
    } finally {
      setIsSavingPromo(false)
    }
  }

  async function handleTogglePromoActive(promo: AdminPromoCodeRow) {
    if (!isSessionAdmin) {
      showErrorToast(
        'Доступ запрещен',
        'Нужен вход под пользователем с ролью администратора сайта.',
      )
      return
    }

    try {
      const updated = await updatePromoCode(promo.id, {
        isActive: !promo.isActive,
      })

      setPromoCodes((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      )
      showSuccessToast(
        updated.isActive ? 'Промокод включен' : 'Промокод отключен',
        `Код ${updated.code} обновлен.`,
      )
    } catch (requestError) {
      showErrorToast(
        'Не удалось обновить промокод',
        requestError instanceof Error ? requestError.message : undefined,
      )
    }
  }

  return (
    <>
      <PromosSection
        promoCodes={promoCodes}
        promoCode={promoCode}
        discountType={discountType}
        discountValue={discountValue}
        maxUses={maxUses}
        maxUsesPerNickname={maxUsesPerNickname}
        startsAt={startsAt}
        endsAt={endsAt}
        isSavingPromo={isSavingPromo}
        setPromoCode={setPromoCode}
        setDiscountType={setDiscountType}
        setDiscountValue={setDiscountValue}
        setMaxUses={setMaxUses}
        setMaxUsesPerNickname={setMaxUsesPerNickname}
        setStartsAt={setStartsAt}
        setEndsAt={setEndsAt}
        handleCreatePromo={handleCreatePromo}
        handleTogglePromoActive={handleTogglePromoActive}
        requestConfirmation={requestConfirmation}
      />

      <AdminConfirmationDialog
        confirmState={confirmState}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setConfirmState(null)
          }
        }}
      />
    </>
  )
}
