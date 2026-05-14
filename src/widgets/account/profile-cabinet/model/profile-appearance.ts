export type ProfileAnimation = 'idle' | 'inspect' | 'wave'
export type ProfileBackground = 'default' | 'emerald' | 'violet' | 'amber'

export type ProfileAppearance = {
  animation: ProfileAnimation
  background: ProfileBackground
}

export const defaultProfileAppearance: ProfileAppearance = {
  animation: 'inspect',
  background: 'default',
}

export const profileAnimations = [
  { id: 'inspect', label: 'Осмотр рук' },
  { id: 'wave', label: 'Приветствие' },
  { id: 'idle', label: 'Спокойно' },
] satisfies { id: ProfileAnimation; label: string }[]

export const profileBackgrounds = [
  { id: 'default', label: 'Тёмный', color: '#1f2420' },
  { id: 'emerald', label: 'Изумруд', color: '#166534' },
  { id: 'violet', label: 'Фиолетовый', color: '#6d28d9' },
  { id: 'amber', label: 'Янтарный', color: '#b45309' },
] satisfies { id: ProfileBackground; label: string; color: string }[]
