import {
  CrouchAnimation,
  FlyingAnimation,
  FunctionAnimation,
  HitAnimation,
  RunningAnimation,
  WalkingAnimation,
  WaveAnimation,
} from 'skin3d'
import { blockbenchProfileAnimations } from './blockbenchProfileAnimations'
import { createBlockbenchAnimation } from './blockbenchAnimationRuntime'
import type { BlockbenchAnimationName } from './blockbenchProfileAnimations'
import type { ProfileAnimation } from '@/widgets/account/profile-cabinet/model/profile-appearance'

const blockbenchAnimationIds = new Set<BlockbenchAnimationName>([
  'idle',
  'animation1',
  'animation2',
  'animation3',
  'animation4',
  'animation5',
  'animation6',
  'animation7',
  'animation8',
])

function isBlockbenchAnimation(
  animation: ProfileAnimation,
): animation is BlockbenchAnimationName {
  return blockbenchAnimationIds.has(animation as BlockbenchAnimationName)
}

function createInspectAnimation() {
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
    player.skin.leftLeg.rotation.x = -0.04 * activeLook + 0.025 * legBalance
    player.skin.rightLeg.rotation.x = -0.04 * activeLook - 0.025 * legBalance
    player.skin.leftLeg.rotation.z = 0.018 * activeLook
    player.skin.rightLeg.rotation.z = -0.018 * activeLook
    player.cape.rotation.x = 0.06 * activeLook
  })
}

export function createProfileAnimation(animation: ProfileAnimation) {
  if (isBlockbenchAnimation(animation)) {
    return createBlockbenchAnimation(blockbenchProfileAnimations[animation])
  }

  switch (animation) {
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
      return createInspectAnimation()
  }
}
