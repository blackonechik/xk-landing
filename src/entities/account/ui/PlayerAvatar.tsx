import { Avatar, type AvatarProps } from '@heroui/react'
import { UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getSkinProxyUrl } from '../api/account-api'

type PlayerAvatarProps = {
  nickname: string
  className?: string
  alt?: string
  size?: AvatarProps['size']
}

type PlayerHeadImageProps = {
  nickname: string
  className?: string
  alt?: string
}

type CachedAppearance = {
  skinSource: string
  avatarSource: string
  objectUrl?: string
}

const appearanceCache = new Map<string, CachedAppearance>()
const appearanceRequests = new Map<string, Promise<CachedAppearance>>()
let defaultSteveAppearance: CachedAppearance | null = null

function createSteveSkinDataUrl() {
  if (typeof document === 'undefined') {
    return ''
  }

  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64

  const context = canvas.getContext('2d')
  if (!context) {
    return ''
  }

  context.imageSmoothingEnabled = false
  context.clearRect(0, 0, 64, 64)

  const paint = (
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
  ) => {
    context.fillStyle = color
    context.fillRect(x, y, width, height)
  }

  const skin = '#d7a37b'
  const skinShade = '#b97d57'
  const hair = '#6b4b34'
  const hairShade = '#4b311f'
  const shirt = '#4c88c7'
  const shirtShade = '#2c5f97'
  const trousers = '#3657a6'
  const trousersShade = '#233d78'
  const shoes = '#5a5a5a'
  const shoesShade = '#3f3f3f'

  paint(8, 8, 8, 8, skin)
  paint(8, 8, 8, 2, hair)
  paint(8, 10, 1, 6, hair)
  paint(15, 10, 1, 6, hair)
  paint(10, 11, 2, 2, '#2f2017')
  paint(12, 11, 2, 2, '#2f2017')
  paint(11, 14, 2, 1, hairShade)

  paint(20, 20, 8, 12, shirt)
  paint(20, 20, 8, 2, shirtShade)

  paint(44, 20, 4, 12, skin)
  paint(44, 20, 4, 2, skinShade)
  paint(36, 52, 4, 12, skin)
  paint(36, 52, 4, 2, skinShade)

  paint(4, 20, 4, 12, shirt)
  paint(4, 20, 4, 2, shirtShade)
  paint(20, 52, 4, 12, shirt)
  paint(20, 52, 4, 2, shirtShade)

  paint(4, 16, 4, 4, skin)
  paint(4, 16, 4, 1, skinShade)
  paint(44, 16, 4, 4, skin)
  paint(44, 16, 4, 1, skinShade)

  paint(4, 32, 4, 12, trousers)
  paint(4, 32, 4, 2, trousersShade)
  paint(4, 44, 4, 4, shoes)
  paint(4, 44, 4, 2, shoesShade)
  paint(20, 48, 4, 12, trousers)
  paint(20, 48, 4, 2, trousersShade)
  paint(20, 60, 4, 4, shoes)
  paint(20, 60, 4, 2, shoesShade)

  paint(28, 52, 4, 12, trousers)
  paint(28, 52, 4, 2, trousersShade)
  paint(28, 60, 4, 4, shoes)
  paint(28, 60, 4, 2, shoesShade)

  paint(12, 48, 4, 12, trousers)
  paint(12, 48, 4, 2, trousersShade)
  paint(12, 60, 4, 4, shoes)
  paint(12, 60, 4, 2, shoesShade)

  paint(20, 32, 8, 4, trousers)
  paint(20, 32, 8, 1, trousersShade)

  return canvas.toDataURL('image/png')
}

function createSteveHeadDataUrl() {
  if (typeof document === 'undefined') {
    return ''
  }

  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64

  const context = canvas.getContext('2d')
  if (!context) {
    return ''
  }

  context.imageSmoothingEnabled = false
  context.clearRect(0, 0, 64, 64)
  context.fillStyle = '#d7a37b'
  context.fillRect(0, 0, 64, 64)
  context.fillStyle = '#6b4b34'
  context.fillRect(0, 0, 64, 10)
  context.fillRect(0, 10, 8, 54)
  context.fillRect(56, 10, 8, 54)
  context.fillStyle = '#2f2017'
  context.fillRect(12, 18, 12, 12)
  context.fillRect(40, 18, 12, 12)
  context.fillStyle = '#b97d57'
  context.fillRect(24, 38, 16, 8)

  return canvas.toDataURL('image/png')
}

function getDefaultSteveAppearance() {
  if (defaultSteveAppearance) {
    return defaultSteveAppearance
  }

  defaultSteveAppearance = {
    skinSource: createSteveSkinDataUrl(),
    avatarSource: createSteveHeadDataUrl(),
  }

  return defaultSteveAppearance
}

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('IMAGE_LOAD_FAILED'))
    image.src = source
  })
}

async function createHeadDataUrlFromSkin(source: string) {
  const image = await loadImage(source)
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64

  const context = canvas.getContext('2d')
  if (!context) {
    return ''
  }

  context.imageSmoothingEnabled = false
  context.clearRect(0, 0, 64, 64)
  context.drawImage(image, 8, 8, 8, 8, 0, 0, 64, 64)

  if (image.width >= 48 && image.height >= 16) {
    context.drawImage(image, 40, 8, 8, 8, 0, 0, 64, 64)
  }

  return canvas.toDataURL('image/png')
}

function getCachedAppearance(identifier: string) {
  return appearanceCache.get(identifier)
}

async function loadAppearance(identifier: string) {
  const fallbackAppearance = getDefaultSteveAppearance()

  if (appearanceCache.has(identifier)) {
    return appearanceCache.get(identifier)!
  }

  const cachedRequest = appearanceRequests.get(identifier)
  if (cachedRequest) {
    return cachedRequest
  }

  const request = fetch(getSkinProxyUrl(identifier))
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('SKIN_FETCH_FAILED')
      }

      const blob = await response.blob()
      if (!blob.size || !blob.type.startsWith('image/')) {
        throw new Error('SKIN_FETCH_FAILED')
      }

      const objectUrl = URL.createObjectURL(blob)
      const avatarSource =
        (await createHeadDataUrlFromSkin(objectUrl)) ||
        fallbackAppearance.avatarSource
      const appearance = {
        skinSource: objectUrl,
        avatarSource,
        objectUrl,
      }

      appearanceCache.set(identifier, appearance)
      return appearance
    })
    .catch(() => {
      const appearance = {
        skinSource: fallbackAppearance.skinSource,
        avatarSource: fallbackAppearance.avatarSource,
      }

      appearanceCache.set(identifier, appearance)
      return appearance
    })
    .finally(() => {
      appearanceRequests.delete(identifier)
    })

  appearanceRequests.set(identifier, request)
  return request
}

export function clearPlayerAppearanceCache(identifier?: string) {
  if (identifier) {
    const cached = appearanceCache.get(identifier)
    if (cached?.objectUrl) {
      URL.revokeObjectURL(cached.objectUrl)
    }

    appearanceCache.delete(identifier)
    appearanceRequests.delete(identifier)
    return
  }

  for (const cached of appearanceCache.values()) {
    if (cached.objectUrl) {
      URL.revokeObjectURL(cached.objectUrl)
    }
  }

  appearanceCache.clear()
  appearanceRequests.clear()
}

export function usePlayerAppearance(identifier: string) {
  const cachedAppearance = getCachedAppearance(identifier)
  const fallbackAppearance = getDefaultSteveAppearance()
  const [skinSource, setSkinSource] = useState(
    () => cachedAppearance?.skinSource ?? fallbackAppearance.skinSource,
  )
  const [avatarSource, setAvatarSource] = useState(
    () => cachedAppearance?.avatarSource ?? fallbackAppearance.avatarSource,
  )

  useEffect(() => {
    const cached = getCachedAppearance(identifier)

    if (cached) {
      setSkinSource(cached.skinSource)
      setAvatarSource(cached.avatarSource)
      return undefined
    }

    let active = true

    void loadAppearance(identifier).then((appearance) => {
      if (!active) {
        return
      }

      setSkinSource(appearance.skinSource)
      setAvatarSource(appearance.avatarSource)
    })

    return () => {
      active = false
    }
  }, [identifier])

  return { avatarSource, skinSource }
}

export function PlayerAvatar({ nickname, className, alt = '', size = "lg" }: PlayerAvatarProps) {
  const { avatarSource } = usePlayerAppearance(nickname)

  return (
    <Avatar size={size} className={className}>
      {avatarSource ? <Avatar.Image alt={alt} src={avatarSource} /> : null}
      <Avatar.Fallback>
        <UserRound size={size === "lg" ? 18 : 14} />
      </Avatar.Fallback>
    </Avatar>
  )
}

export function PlayerHeadImage({
  nickname,
  className,
  alt = '',
}: PlayerHeadImageProps) {
  const { avatarSource } = usePlayerAppearance(nickname)

  return <img alt={alt} className={className} src={avatarSource} />
}
