import { useEffect, useRef } from 'react'
import { SkinViewer as MinecraftSkinViewer, WalkingAnimation } from 'skinview3d'

type SkinViewerProps = {
  nickname: string
  uuid: string | null
}

export function SkinViewer({ nickname, uuid }: SkinViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return undefined
    }

    const skin = uuid
      ? `https://crafatar.com/skins/${uuid}`
      : `https://minotar.net/skin/${nickname}`
    const viewer = new MinecraftSkinViewer({
      canvas,
      width: 360,
      height: 460,
      skin,
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
  }, [nickname, uuid])

  return (
    <div className="xk-skin-viewer">
      <canvas ref={canvasRef} aria-label={`3D-скин игрока ${nickname}`} />
    </div>
  )
}
