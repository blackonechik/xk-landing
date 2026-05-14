import { useEffect, useState } from 'react'
import { Alert, Spinner } from '@heroui/react'
import { fetchPlayerProfile, type PublicPlayerProfile } from '@/entities/player'
import { PlayerProfileView } from '@/widgets/account/profile-cabinet'
import { HeroLinkButton, HeroPage } from '@/shared/ui/hero-page'

type PublicPlayerPageProps = {
  nickname: string
}

export function PublicPlayerPage({ nickname }: PublicPlayerPageProps) {
  const [player, setPlayer] = useState<PublicPlayerProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    setIsLoading(true)
    void fetchPlayerProfile(nickname)
      .then((nextPlayer) => {
        if (isActive) {
          setPlayer(nextPlayer)
          setError('')
        }
      })
      .catch((loadError) => {
        if (isActive) {
          setPlayer(null)
          setError(
            loadError instanceof Error && loadError.message === 'PLAYER_NOT_FOUND'
              ? 'Игрок не найден в статистике PlayTimeManager.'
              : 'Не получилось загрузить профиль игрока.',
          )
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [nickname])

  return (
    <HeroPage
      eyebrow="Профиль игрока"
      title={player?.nickname ?? nickname}
      description="Публичная страница игрока XK HARDCORE."
      actions={
        <HeroLinkButton to="/players" variant="secondary">
          Все игроки
        </HeroLinkButton>
      }
    >
      {isLoading ? (
        <Alert status="accent">
          <Alert.Indicator>
            <Spinner size="sm" />
          </Alert.Indicator>
          <Alert.Content>
            <Alert.Title>Загружаем профиль игрока</Alert.Title>
          </Alert.Content>
        </Alert>
      ) : error ? (
        <Alert status="warning">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{error}</Alert.Title>
          </Alert.Content>
        </Alert>
      ) : null}

      {player ? (
        <PlayerProfileView
          appearance={player.appearance}
          onPlayerChange={setPlayer}
          player={player}
        />
      ) : null}
    </HeroPage>
  )
}
