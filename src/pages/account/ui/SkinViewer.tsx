import { useEffect, useRef, useState } from 'react'
import { SkinViewer as MinecraftSkinViewer, WalkingAnimation } from 'skinview3d'
import { getSkinProxyUrl } from '../model/api'

type SkinViewerProps = {
  nickname: string
  uuid: string | null
}

export function SkinViewer({ nickname, uuid }: SkinViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [skinSource, setSkinSource] = useState<string | null>(null)

  function createFallbackSkinDataUrl(name: string) {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64

    const context = canvas.getContext('2d')
    if (!context) {
      return ''
    }

    const seed = name
      .split('')
      .reduce((accumulator, char) => accumulator + char.charCodeAt(0), 0)
    const hue = seed % 360

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

  useEffect(() => {
    let active = true
    let objectUrl: string | null = null

    setSkinSource(createFallbackSkinDataUrl(nickname))

    const controller = new AbortController()

    void fetch(getSkinProxyUrl(uuid ?? nickname), {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('SKIN_FETCH_FAILED')
        }

        const blob = await response.blob()
        if (!active) {
          return
        }

        objectUrl = URL.createObjectURL(blob)
        setSkinSource(objectUrl)
      })
      .catch(() => {
        if (!active) {
          return
        }

        setSkinSource(createFallbackSkinDataUrl(nickname))
      })

    return () => {
      active = false
      controller.abort()

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [nickname, uuid])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !skinSource) {
      return undefined
    }

    const viewer = new MinecraftSkinViewer({
      canvas,
      width: 360,
      height: 460,
      skin: skinSource,
    })

    viewer.camera.position.set(0, 18, 58)
    viewer.animation = new WalkingAnimation()
    viewer.animation.speed = 0.55
    viewer.controls.enableRotate = true
    viewer.controls.enableZoom = false
    viewer.controls.enablePan = false

    return () => {
      viewer.dispose()
    }
  }, [nickname, skinSource, uuid])

  return (
    <div className="xk-skin-viewer">
      <canvas ref={canvasRef} aria-label={`3D-скин игрока ${nickname}`} />
    </div>
  )
}
