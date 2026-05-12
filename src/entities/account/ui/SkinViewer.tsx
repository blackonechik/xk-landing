import { Avatar } from '@heroui/react'
import { UserRound } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { SkinViewer as MinecraftSkinViewer, WalkingAnimation } from 'skinview3d'
import { usePlayerAppearance } from './PlayerAvatar'

type SkinViewerProps = {
  nickname: string
  uuid: string | null
}

export function SkinViewer({ nickname, uuid }: SkinViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { avatarSource, skinSource } = usePlayerAppearance(nickname)

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
    <div className="xk-skin-viewer relative">
      <canvas ref={canvasRef} aria-label={`3D-скин игрока ${nickname}`} />
      <div className="pointer-events-none absolute bottom-4 right-4">
        <Avatar className="size-16 border border-white/12 bg-black/30 shadow-lg backdrop-blur-sm">
          {avatarSource ? <Avatar.Image alt="" src={avatarSource} /> : null}
          <Avatar.Fallback>
            <UserRound size={18} />
          </Avatar.Fallback>
        </Avatar>
      </div>
    </div>
  )
}
