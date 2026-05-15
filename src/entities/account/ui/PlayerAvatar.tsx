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

function getHueSeed(name: string) {
  return name
    .split('')
    .reduce((accumulator, char) => accumulator + char.charCodeAt(0), 0) % 360
}

function createFallbackSkinDataUrl(name: string) {
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

  const hue = getHueSeed(name)

  context.fillStyle = '#000000'
  context.fillRect(0, 0, 64, 64)
  context.fillStyle = `hsl(${hue}, 65%, 48%)`
  context.fillRect(8, 8, 24, 24)
  context.fillStyle = `hsl(${(hue + 28) % 360}, 72%, 34%)`
  context.fillRect(8, 32, 24, 24)
  context.fillStyle = 'rgba(255,255,255,0.16)'
  context.fillRect(32, 8, 24, 48)

  return canvas.toDataURL('image/png')
}

function createFallbackHeadDataUrl(name: string) {
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

  const hue = getHueSeed(name)

  context.imageSmoothingEnabled = false
  context.clearRect(0, 0, 64, 64)
  context.fillStyle = `hsl(${hue}, 58%, 52%)`
  context.fillRect(0, 0, 64, 64)
  context.fillStyle = `hsl(${(hue + 14) % 360}, 55%, 38%)`
  context.fillRect(0, 0, 64, 10)
  context.fillStyle = 'rgba(255,255,255,0.18)'
  context.fillRect(8, 12, 12, 12)
  context.fillRect(44, 12, 12, 12)
  context.fillStyle = 'rgba(0,0,0,0.5)'
  context.fillRect(14, 26, 36, 6)
  context.fillStyle = 'rgba(255,255,255,0.1)'
  context.fillRect(0, 0, 64, 64)

  return canvas.toDataURL('image/png')
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
  const fallbackSkin = createFallbackSkinDataUrl(identifier)
  const fallbackAvatar = createFallbackHeadDataUrl(identifier)

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
      const objectUrl = URL.createObjectURL(blob)
      const avatarSource = (await createHeadDataUrlFromSkin(objectUrl)) || fallbackAvatar
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
        skinSource: fallbackSkin,
        avatarSource: fallbackAvatar,
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
  const [skinSource, setSkinSource] = useState(
    () => cachedAppearance?.skinSource ?? createFallbackSkinDataUrl(identifier),
  )
  const [avatarSource, setAvatarSource] = useState(
    () =>
      cachedAppearance?.avatarSource ?? createFallbackHeadDataUrl(identifier),
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
