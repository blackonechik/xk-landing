export type ProfileAnimation =
  | 'idle'
  | 'inspect'
  | 'wave'
  | 'walk'
  | 'run'
  | 'fly'
  | 'crouch'
  | 'hit'

export type CustomProfileBackground = `#${string}`

export type ProfileBackground =
  | 'palette-slate'
  | 'palette-emerald'
  | 'palette-amber'
  | 'palette-rose'
  | 'palette-violet'
  | 'palette-sky'
  | 'palette-zinc'
  | 'plains'
  | 'nether'
  | 'end'
  | CustomProfileBackground

export type ProfileAppearance = {
  animation: ProfileAnimation
  background: ProfileBackground
}

export const defaultProfileAppearance: ProfileAppearance = {
  animation: 'inspect',
  background: 'palette-slate',
}

export const profileAnimations = [
  { id: 'inspect', label: 'Осмотр рук' },
  { id: 'wave', label: 'Приветствие' },
  { id: 'walk', label: 'Прогулка' },
  { id: 'run', label: 'Бег' },
  { id: 'fly', label: 'Полёт' },
  { id: 'crouch', label: 'Приседание' },
  { id: 'hit', label: 'Удар' },
  { id: 'idle', label: 'Спокойно' },
] satisfies { id: ProfileAnimation; label: string }[]

export const profileBackgrounds = [
  {
    id: 'palette-slate',
    kind: 'palette',
    label: 'Графит',
    swatch: 'bg-[linear-gradient(135deg,#111827,#475569,#e5e7eb)]',
    background: '#111827',
  },
  {
    id: 'palette-emerald',
    kind: 'palette',
    label: 'Изумруд',
    swatch: 'bg-[linear-gradient(135deg,#052e16,#16a34a,#bbf7d0)]',
    background: '#052e16',
  },
  {
    id: 'palette-amber',
    kind: 'palette',
    label: 'Янтарь',
    swatch: 'bg-[linear-gradient(135deg,#451a03,#f59e0b,#fef3c7)]',
    background: '#451a03',
  },
  {
    id: 'palette-rose',
    kind: 'palette',
    label: 'Роза',
    swatch: 'bg-[linear-gradient(135deg,#4c0519,#e11d48,#ffe4e6)]',
    background: '#4c0519',
  },
  {
    id: 'palette-violet',
    kind: 'palette',
    label: 'Фиолет',
    swatch: 'bg-[linear-gradient(135deg,#2e1065,#7c3aed,#ede9fe)]',
    background: '#2e1065',
  },
  {
    id: 'palette-sky',
    kind: 'palette',
    label: 'Небо',
    swatch: 'bg-[linear-gradient(135deg,#082f49,#0ea5e9,#e0f2fe)]',
    background: '#082f49',
  },
  {
    id: 'palette-zinc',
    kind: 'palette',
    label: 'Монохром',
    swatch: 'bg-[linear-gradient(135deg,#09090b,#71717a,#fafafa)]',
    background: '#09090b',
  },
  {
    id: 'plains',
    kind: 'panorama',
    label: 'Оверворлд',
    swatch: 'bg-[linear-gradient(180deg,#7ec8ff_0_48%,#62a84f_48%_100%)]',
    background: '#8ac7ff',
    panorama: '/assets/img/profile/panoramas/trails',
    source: 'Modrinth: Shader Panorama of 1.20',
  },
  {
    id: 'nether',
    kind: 'panorama',
    label: 'Пещера',
    swatch: 'bg-[linear-gradient(135deg,#102a1f,#31523f,#94a3b8)]',
    background: '#102a1f',
    panorama: '/assets/img/profile/panoramas/m4sub',
    source: 'Modrinth: m4sub panorama',
  },
  {
    id: 'end',
    kind: 'panorama',
    label: 'Горы',
    swatch: 'bg-[linear-gradient(135deg,#0f172a,#475569,#dbeafe)]',
    background: '#0f172a',
    panorama: '/assets/img/profile/panoramas/jamp',
    source: 'Modrinth: Jamp',
  },
] satisfies {
  id: ProfileBackground
  kind: 'palette' | 'panorama'
  label: string
  swatch: string
  background: string
  panorama?: string
  source?: string
}[]

export const profilePaletteBackgrounds = profileBackgrounds.filter(
  (item) => item.kind === 'palette',
)

export const profilePanoramaBackgrounds = profileBackgrounds.filter(
  (item) => item.kind === 'panorama',
)

export function isCustomProfileBackground(
  background: string,
): background is CustomProfileBackground {
  return /^#[0-9a-f]{6}$/i.test(background)
}

export function getProfileBackgroundColor(background: ProfileBackground) {
  if (isCustomProfileBackground(background)) {
    return background
  }

  return (
    profileBackgrounds.find((item) => item.id === background)?.background ??
    profilePaletteBackgrounds[0].background
  )
}

export function getProfileBackgroundLabel(background: ProfileBackground) {
  if (isCustomProfileBackground(background)) {
    return `Свой цвет ${background.toUpperCase()}`
  }

  return (
    profileBackgrounds.find((item) => item.id === background)?.label ??
    profilePaletteBackgrounds[0].label
  )
}
