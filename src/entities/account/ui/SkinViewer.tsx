import { Avatar } from '@heroui/react'
import { UserRound } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { FunctionAnimation, Render as Skin3dRender } from 'skin3d'
import { usePlayerAppearance } from './PlayerAvatar'
import type {
  ProfileAnimation,
  ProfileBackground,
} from '@/widgets/account/profile-cabinet/model/profile-appearance'

type SkinViewerProps = {
  nickname: string
  animation?: ProfileAnimation
  background?: ProfileBackground
}

const backgroundClasses: Record<ProfileBackground, string> = {
  amber: 'from-amber-950/50 via-[var(--surface)] to-[var(--background)]',
  default: 'from-white/10 via-[var(--surface)] to-[var(--background)]',
  emerald: 'from-emerald-950/55 via-[var(--surface)] to-[var(--background)]',
  violet: 'from-violet-950/55 via-[var(--surface)] to-[var(--background)]',
}

export function SkinViewer({
  nickname,
  animation = 'inspect',
  background = 'default',
}: SkinViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationTimeoutRef = useRef<number | null>(null)
  const idleTimeoutRef = useRef<number | null>(null)
  const { avatarSource, skinSource } = usePlayerAppearance(nickname)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !skinSource) {
      return undefined
    }

    const viewer = new Skin3dRender({
      canvas,
      width: 360,
      height: 460,
      skin: skinSource,
      allowRotateX: false,
      allowRotateY: true,
      allowZoom: false,
    })

    viewer.camera.position.set(0, 18, 58)
    viewer.animation = null
    viewer.controls.enablePan = false
    viewer.controls.enableZoom = false
    viewer.controls.minPolarAngle = Math.PI / 2
    viewer.controls.maxPolarAngle = Math.PI / 2

    const clearTimers = () => {
      if (animationTimeoutRef.current !== null) {
        window.clearTimeout(animationTimeoutRef.current)
        animationTimeoutRef.current = null
      }

      if (idleTimeoutRef.current !== null) {
        window.clearTimeout(idleTimeoutRef.current)
        idleTimeoutRef.current = null
      }
    }

    const playInspectAnimation = () => {
      const inspectAnimation = new FunctionAnimation((player, progress) => {
        const duration = 4.2
        const t = Math.min(progress / duration, 1)
        const smoothstep = (edge0: number, edge1: number, value: number) => {
          const x = Math.min(Math.max((value - edge0) / (edge1 - edge0), 0), 1)
          return x * x * (3 - 2 * x)
        }
        const pulse = (start: number, holdStart: number, holdEnd: number, end: number) => {
          const enter = smoothstep(start, holdStart, t)
          const exit = smoothstep(holdEnd, end, t)
          return enter * (1 - exit)
        }

        const leftLook = pulse(0.02, 0.2, 0.38, 0.54)
        const rightLook = pulse(0.48, 0.66, 0.82, 0.98)
        const activeLook = Math.max(leftLook, rightLook)
        const breathe = Math.sin(progress * 2.2) * 0.015
        const leftInspect = Math.sin(progress * 7) * leftLook
        const rightInspect = Math.sin(progress * 7) * rightLook
        const leftWristRoll = Math.sin(progress * 9.5) * leftLook
        const rightWristRoll = Math.sin(progress * 9.5) * rightLook
        const legBalance = Math.sin(progress * 3.4) * activeLook

        player.skin.head.rotation.x = 0.42 * activeLook
        player.skin.head.rotation.y = 0.3 * leftLook - 0.3 * rightLook
        player.skin.head.rotation.z = 0.08 * leftLook - 0.08 * rightLook

        player.skin.leftArm.rotation.x = -1.18 * leftLook - 0.08 * rightLook
        player.skin.leftArm.rotation.y = 0.28 * leftLook + 0.1 * leftInspect
        player.skin.leftArm.rotation.z =
          0.5 * leftLook + 0.04 + breathe + 0.18 * leftWristRoll
        player.skin.leftArm.rotation.order = 'YXZ'

        player.skin.rightArm.rotation.x = -0.08 * leftLook - 1.18 * rightLook
        player.skin.rightArm.rotation.y = -0.28 * rightLook - 0.1 * rightInspect
        player.skin.rightArm.rotation.z =
          -0.04 - 0.5 * rightLook - breathe - 0.18 * rightWristRoll
        player.skin.rightArm.rotation.order = 'YXZ'

        player.skin.body.rotation.y = 0.04 * leftLook - 0.04 * rightLook
        player.skin.body.rotation.x = 0.03 * activeLook
        player.skin.leftLeg.rotation.x = -0.04 * activeLook + 0.025 * legBalance
        player.skin.rightLeg.rotation.x = -0.04 * activeLook - 0.025 * legBalance
        player.skin.leftLeg.rotation.z = 0.018 * activeLook
        player.skin.rightLeg.rotation.z = -0.018 * activeLook
        player.cape.rotation.x = 0.06 * activeLook

        if (t >= 1) {
          player.resetJoints()
        }
      })

      inspectAnimation.speed = 1
      viewer.animation = inspectAnimation

      animationTimeoutRef.current = window.setTimeout(() => {
        viewer.animation = null
        queueNextAnimation()
      }, 4400)
    }

    const playWaveAnimation = () => {
      const waveAnimation = new FunctionAnimation((player, progress) => {
        const wave = Math.sin(progress * 7) * 0.35
        player.skin.rightArm.rotation.x = -1.85
        player.skin.rightArm.rotation.y = -0.2
        player.skin.rightArm.rotation.z = -0.55 + wave
        player.skin.head.rotation.y = Math.sin(progress * 1.8) * 0.12
        player.skin.body.rotation.y = Math.sin(progress * 1.8) * 0.04
      })

      waveAnimation.speed = 1
      viewer.animation = waveAnimation

      animationTimeoutRef.current = window.setTimeout(() => {
        viewer.animation = null
        queueNextAnimation()
      }, 4200)
    }

    const queueNextAnimation = () => {
      clearTimers()

      if (animation === 'idle') {
        viewer.animation = null
        return
      }

      idleTimeoutRef.current = window.setTimeout(() => {
        if (animation === 'wave') {
          playWaveAnimation()
          return
        }

        playInspectAnimation()
      }, 1400)
    }

    queueNextAnimation()

    return () => {
      clearTimers()
      viewer.dispose()
    }
  }, [animation, nickname, skinSource])

  return (
    <div
      className={[
        'relative grid min-h-[456px] place-items-center overflow-hidden rounded-lg border border-[var(--separator)] bg-gradient-to-br shadow-inner',
        backgroundClasses[background],
      ].join(' ')}
    >
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
