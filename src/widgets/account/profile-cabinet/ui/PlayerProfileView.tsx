import type { ReactNode } from 'react'
import type { PublicPlayerProfile } from '@/entities/player'
import { ProfileActivityPanel } from './ProfileActivityPanel'
import { ProfileCharacterPanel } from './ProfileCharacterPanel'
import { ProfileStatusPanel } from './ProfileStatusPanel'
import type { ProfileAppearance } from '../model/profile-appearance'

type PlayerProfileViewProps = {
  player: PublicPlayerProfile
  actions?: ReactNode
  appearance?: ProfileAppearance
  isOwnProfile?: boolean
  totalDiamonds?: number
  onAppearanceChange?: (appearance: ProfileAppearance) => void
  onPlayerChange?: (player: PublicPlayerProfile) => void
}

export function PlayerProfileView({
  player,
  actions,
  appearance,
  isOwnProfile = false,
  totalDiamonds,
  onAppearanceChange,
  onPlayerChange,
}: PlayerProfileViewProps) {
  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(320px,0.44fr)_minmax(0,1fr)]">
      <div className="xl:sticky xl:top-0 xl:self-start">
        <ProfileCharacterPanel
          appearance={appearance}
          isEditable={isOwnProfile}
          isOwnProfile={isOwnProfile}
          nickname={player.nickname}
          onAppearanceChange={onAppearanceChange}
          onPlayerChange={onPlayerChange}
          player={player}
        />
      </div>
      <div className="grid gap-6">
        <ProfileStatusPanel
          actions={actions}
          isOwnProfile={isOwnProfile}
          player={player}
          totalDiamonds={totalDiamonds}
        />
        <ProfileActivityPanel player={player} />
      </div>
    </div>
  )
}
