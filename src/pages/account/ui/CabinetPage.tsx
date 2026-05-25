import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Alert, Button, Spinner } from '@heroui/react'
import {
  fetchAccountCached,
  getCachedAccount,
  logout,
  updateProfileAppearance,
} from '@/entities/account'
import { fetchSiteSettingsCached, type SiteSettings } from '@/entities/site'
import { fetchPlayerProfile, type PublicPlayerProfile } from '@/entities/player'
import {
  defaultProfileAppearance,
  PlayerProfileView,
  type ProfileAppearance,
} from '@/widgets/account/profile-cabinet'
import { AccountLayout } from '@/widgets/account/layout'
import { HeroLinkButton, HeroPage } from '@/shared/ui/hero-page'
import type { AccountPayload } from '@/entities/account'

export function CabinetPage() {
  const navigate = useNavigate()
  const [account, setAccount] = useState<AccountPayload | null>(() =>
    getCachedAccount(),
  )
  const [appearance, setAppearance] = useState<ProfileAppearance>(
    defaultProfileAppearance,
  )
  const [playerProfile, setPlayerProfile] =
    useState<PublicPlayerProfile | null>(null)
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [error, setError] = useState('')

  async function loadAccount() {
    try {
      const payload = await fetchAccountCached()
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
    void fetchSiteSettingsCached()
      .then((payload) => setSettings(payload))
      .catch(() => setSettings({ navigation: { showBank: true, items: [] } }))
  }, [])

  useEffect(() => {
    if (account?.player.appearance) {
      setAppearance(account.player.appearance)
    }
  }, [account?.player.appearance])

  useEffect(() => {
    if (!account?.player.nickname) {
      return undefined
    }

    let isActive = true

    void fetchPlayerProfile(account.player.nickname)
      .then((profile) => {
        if (isActive) {
          setPlayerProfile({
            ...profile,
            lives: account.player.lives,
            lastLoginAt: account.player.lastLoginAt,
            appearance: account.player.appearance ?? profile.appearance,
          })
        }
      })
      .catch(() => {
        if (isActive) {
          setPlayerProfile({
            nickname: account.player.nickname,
            uuid: account.player.uuid,
            lives: account.player.lives,
            lastLoginAt: account.player.lastLoginAt,
            playedHours: 0,
            isOnline: true,
            stats: {
              totalHours: 0,
              monthHours: 0,
              weekHours: 0,
              todayHours: 0,
            },
            activity: [],
            appearance: account.player.appearance ?? defaultProfileAppearance,
            rating: {
              likes: 0,
              dislikes: 0,
              score: 0,
              currentUserRating: 0,
            },
          })
        }
      })

    return () => {
      isActive = false
    }
  }, [account])

  const totalDiamonds = useMemo(
    () =>
      account?.bank.cards.reduce(
        (sum, card) => sum + card.balanceDiamonds,
        0,
      ) ?? 0,
    [account],
  )

  function handleAppearanceChange(nextAppearance: ProfileAppearance) {
    setAppearance(nextAppearance)
    void updateProfileAppearance(nextAppearance)
      .then((savedAppearance) => setAppearance(savedAppearance))
      .catch(() => setAppearance(account?.player.appearance ?? defaultProfileAppearance))
  }

  if (!account) {
    return (
      <HeroPage
        eyebrow="Аккаунт"
        title="Загружаем кабинет"
        description="Собираем данные профиля, банка и статуса игрока."
        narrow
      >
        <Alert status="accent">
          <Alert.Indicator>
            <Spinner size="sm" />
          </Alert.Indicator>
          <Alert.Content>
            <Alert.Title>Пожалуйста, подождите</Alert.Title>
          </Alert.Content>
        </Alert>
      </HeroPage>
    )
  }

  return (
    <AccountLayout
      account={account}
      currentSection="home"
      onNavigate={(to) => {
        void navigate({ to })
      }}
      onBankViewNavigate={(view) => {
        void navigate({
          to: `/cabinet/bank/${view}`,
        })
      }}
      eyebrow="Аккаунт"
      title="Личный кабинет"
      description="Личный кабинет активно разрабатывается. Если вы нашли ошибку или хотите предложить улучшение, пожалуйста, сообщите нам в Discord."
    >
      {playerProfile ? (
        <PlayerProfileView
          appearance={appearance}
          isOwnProfile
          onAppearanceChange={handleAppearanceChange}
          onPlayerChange={setPlayerProfile}
          player={playerProfile}
          totalDiamonds={totalDiamonds}
        />
      ) : null}

      {error ? (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{error}</Alert.Title>
          </Alert.Content>
        </Alert>
      ) : null}
    </AccountLayout>
  )
}
