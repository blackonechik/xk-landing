import type { ReactNode } from 'react'
import { Avatar } from '@heroui/react'
import { UserRound } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { NoToneMapping } from 'three'
import { Render as Skin3dRender } from 'skin3d'
import { usePlayerAppearance } from './PlayerAvatar'
import { createProfileAnimation } from '@/entities/account/model/profileAnimationLibrary'
import type {
  ProfileAnimation,
  ProfileBackground,
} from '@/widgets/account/profile-cabinet/model/profile-appearance'
import {
  getProfileBackgroundColor,
} from '@/widgets/account/profile-cabinet/model/profile-appearance'

type SkinViewerProps = {
  nickname: string
  animation?: ProfileAnimation
  background?: ProfileBackground
  topRightAction?: ReactNode
}

const viewerFrameClassName =
  'relative grid min-h-[380px] w-full place-items-center overflow-hidden rounded-lg border border-[var(--separator)] bg-[var(--surface)] shadow-inner'

function configureViewer(
  canvas: HTMLCanvasElement,
  skinSource: string,
  background: ProfileBackground,
) {
  const viewer = new Skin3dRender({
    canvas,
    width: 320,
    height: 408,
    skin: skinSource,
    background: getProfileBackgroundColor(background),
    zoom: 0.68,
    allowRotateX: false,
    allowRotateY: true,
    allowZoom: false,
  })

  viewer.renderer.toneMapping = NoToneMapping
  viewer.camera.position.set(0, 14, 1)
  viewer.adjustCameraDistance()
  viewer.controls.enablePan = false
  viewer.controls.enableZoom = false
  viewer.controls.minPolarAngle = Math.PI / 2
  viewer.controls.maxPolarAngle = Math.PI / 2

  return viewer
}

function resizeViewer(
  viewer: Skin3dRender,
  container: HTMLDivElement | null,
) {
  if (!container) {
    return
  }

  const width = Math.max(280, Math.floor(container.clientWidth))
  const height = Math.round(width * 1.22)

  viewer.setSize(width, height)
  viewer.adjustCameraDistance()
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

    const viewer = configureViewer(canvas, skinSource, background)
    viewer.animation = createProfileAnimation(animation)

    const resizeCurrentViewer = () => {
      resizeViewer(viewer, containerRef.current)
    }

    const resizeObserver = new ResizeObserver(resizeCurrentViewer)
    resizeObserver.observe(containerRef.current ?? canvas)
    resizeCurrentViewer()

    return () => {
      resizeObserver.disconnect()
      viewer.dispose()
    }
  }, [animation, background, nickname, skinSource])

  return (
    <div className={viewerFrameClassName} ref={containerRef}>
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
