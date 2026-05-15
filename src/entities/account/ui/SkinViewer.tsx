import type { ReactNode } from 'react'
import { Avatar } from '@heroui/react'
import { UserRound } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { CubeTextureLoader, NoToneMapping } from 'three'
import {
  CrouchAnimation,
  FlyingAnimation,
  FunctionAnimation,
  HitAnimation,
  IdleAnimation,
  Render as Skin3dRender,
  RunningAnimation,
  WalkingAnimation,
  WaveAnimation,
} from 'skin3d'
import { usePlayerAppearance } from './PlayerAvatar'
import type {
  ProfileAnimation,
  ProfileBackground,
} from '@/widgets/account/profile-cabinet/model/profile-appearance'
import { profileBackgrounds } from '@/widgets/account/profile-cabinet/model/profile-appearance'

type SkinViewerProps = {
  nickname: string
  animation?: ProfileAnimation
  background?: ProfileBackground
  topRightAction?: ReactNode
}

function createAnimation(animation: ProfileAnimation) {
  switch (animation) {
    case 'idle':
      return new IdleAnimation()
    case 'wave':
      return new WaveAnimation('right')
    case 'walk':
      return new WalkingAnimation()
    case 'run':
      return new RunningAnimation()
    case 'fly':
      return new FlyingAnimation()
    case 'crouch':
      return new CrouchAnimation()
    case 'hit':
      return new HitAnimation()
    case 'inspect':
      return new FunctionAnimation((player, progress) => {
        const duration = 4.2
        const t = (progress % duration) / duration
        const smoothstep = (edge0: number, edge1: number, value: number) => {
          const x = Math.min(Math.max((value - edge0) / (edge1 - edge0), 0), 1)
          return x * x * (3 - 2 * x)
        }
        const pulse = (
          start: number,
          holdStart: number,
          holdEnd: number,
          end: number,
        ) => {
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
        player.skin.leftLeg.rotation.x =
          -0.04 * activeLook + 0.025 * legBalance
        player.skin.rightLeg.rotation.x =
          -0.04 * activeLook - 0.025 * legBalance
        player.skin.leftLeg.rotation.z = 0.018 * activeLook
        player.skin.rightLeg.rotation.z = -0.018 * activeLook
        player.cape.rotation.x = 0.06 * activeLook
      })
  }
}

export function SkinViewer({
  nickname,
  animation = 'inspect',
  background = 'palette-slate',
  topRightAction,
}: SkinViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { avatarSource, skinSource } = usePlayerAppearance(nickname)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !skinSource) {
      return undefined
    }

    const backgroundConfig =
      profileBackgrounds.find((item) => item.id === background) ??
      profileBackgrounds[0]

    const viewer = new Skin3dRender({
      canvas,
      width: 320,
      height: 408,
      skin: skinSource,
      background: backgroundConfig.background,
      zoom: 0.68,
      allowRotateX: false,
      allowRotateY: true,
      allowZoom: false,
    })

    const cubeTexture = backgroundConfig.panorama
      ? new CubeTextureLoader().load([
          `${backgroundConfig.panorama}/panorama_1.png`,
          `${backgroundConfig.panorama}/panorama_3.png`,
          `${backgroundConfig.panorama}/panorama_4.png`,
          `${backgroundConfig.panorama}/panorama_5.png`,
          `${backgroundConfig.panorama}/panorama_0.png`,
          `${backgroundConfig.panorama}/panorama_2.png`,
        ])
      : null

    if (cubeTexture) {
      viewer.scene.background = cubeTexture
      viewer.scene.backgroundIntensity = 1.75
    }

    viewer.renderer.toneMapping = NoToneMapping

    viewer.camera.position.set(0, 14, 1)
    viewer.adjustCameraDistance()
    viewer.animation = createAnimation(animation)
    viewer.controls.enablePan = false
    viewer.controls.enableZoom = false
    viewer.controls.minPolarAngle = Math.PI / 2
    viewer.controls.maxPolarAngle = Math.PI / 2

    const resizeViewer = () => {
      const container = containerRef.current
      if (!container) {
        return
      }

      const width = Math.max(280, Math.floor(container.clientWidth))
      const height = Math.round(width * 1.22)

      viewer.setSize(width, height)
      viewer.adjustCameraDistance()
    }

    const resizeObserver = new ResizeObserver(resizeViewer)
    resizeObserver.observe(containerRef.current ?? canvas)
    resizeViewer()

    return () => {
      resizeObserver.disconnect()
      cubeTexture?.dispose()
      viewer.dispose()
    }
  }, [animation, background, nickname, skinSource])

  return (
    <div
      className="relative grid min-h-[380px] w-full place-items-center overflow-hidden rounded-lg border border-[var(--separator)] bg-[var(--surface)] shadow-inner"
      ref={containerRef}
    >
      {topRightAction ? (
        <div className="absolute right-3 top-3 z-10">{topRightAction}</div>
      ) : null}
      <canvas
        className="relative z-[1] block max-w-full"
        ref={canvasRef}
        aria-label={`3D-скин игрока ${nickname}`}
      />
      <div className="pointer-events-none absolute bottom-4 right-4 z-10">
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
