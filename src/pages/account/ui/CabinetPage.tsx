import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { fetchAccount, logout, type AccountPayload } from '@/entities/account'
import {
  ProfileCharacterPanel,
  ProfileHero,
  ProfileStatusPanel,
} from '@/widgets/account/profile-cabinet'

export function CabinetPage() {
  const navigate = useNavigate()
  const [account, setAccount] = useState<AccountPayload | null>(null)
  const [error, setError] = useState('')

  async function loadAccount() {
    try {
      const payload = await fetchAccount()
      setAccount(payload)
    } catch (loadError) {
      if (loadError instanceof Error && loadError.message === 'UNAUTHORIZED') {
        await navigate({ to: '/login' })
        return
      }

      setError('Не получилось загрузить кабинет.')
    }
  }

  useEffect(() => {
    void loadAccount()
  }, [])

  const totalDiamonds = useMemo(
    () =>
      account?.bank.cards.reduce(
        (sum, card) => sum + card.balanceDiamonds,
        0,
      ) ?? 0,
    [account],
  )

  if (!account) {
    return (
      <main className="xk-cabinet-page">
        <section className="page-wrap xk-cabinet-loading">
          Загружаем кабинет...
        </section>
      </main>
    )
  }

  return (
    <main className="xk-cabinet-page">
      <ProfileHero
        account={account}
        totalDiamonds={totalDiamonds}
        onLogout={async () => {
          await logout()
          await navigate({ to: '/' })
        }}
      />

      <section className="page-wrap xk-cabinet-grid">
        <ProfileCharacterPanel account={account} />
        <ProfileStatusPanel account={account} totalDiamonds={totalDiamonds} />
      </section>

      {error ? (
        <section className="page-wrap xk-cabinet-error">{error}</section>
      ) : null}
    </main>
  )
}
