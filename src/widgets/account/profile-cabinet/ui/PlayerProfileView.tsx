import type { ReactNode } from 'react'
import type { PublicPlayerProfile } from '@/entities/player'
import { ProfileActivityPanel } from './ProfileActivityPanel'
import { ProfileCharacterPanel } from './ProfileCharacterPanel'
import { ProfileRatingPanel } from './ProfileRatingPanel'
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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.44fr)_minmax(0,1fr)]">
      <ProfileCharacterPanel
        appearance={appearance}
        isEditable={isOwnProfile}
        nickname={player.nickname}
        onAppearanceChange={onAppearanceChange}
      />
      <ProfileStatusPanel
        actions={actions}
        isOwnProfile={isOwnProfile}
        player={player}
        ratingSlot={
          <ProfileRatingPanel
            isOwnProfile={isOwnProfile}
            onPlayerChange={onPlayerChange}
            player={player}
          />
        }
        totalDiamonds={totalDiamonds}
      />
      <div className="xl:col-span-2">
        <ProfileActivityPanel player={player} />
      </div>
    </div>
  )
}
