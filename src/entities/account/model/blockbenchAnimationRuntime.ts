import { FunctionAnimation } from 'skin3d'
import { Euler, Vector3 } from 'three'
import type { PlayerObject } from 'skin3d'
import type { BlockbenchAnimationClip } from './blockbenchProfileAnimations'

type Keyframe = readonly [time: number, x: number, y: number, z: number]

type TrackBoneName =
  | 'Waist'
  | 'Head'
  | 'Right Arm'
  | 'Left Arm'
  | 'Right Leg'
  | 'Left Leg'

const animatedTrackBoneMap = {
  Waist: 'player',
  Head: 'head',
  'Right Arm': 'rightArm',
  'Left Arm': 'leftArm',
  'Right Leg': 'rightLeg',
  'Left Leg': 'leftLeg',
} as const satisfies Record<TrackBoneName, 'player' | keyof PlayerObject['skin']>

function easeInOutSine(progress: number) {
  if (progress <= 0) {
    return 0
  }

  if (progress >= 1) {
    return 1
  }

  return 0.5 - Math.cos(progress * Math.PI) / 2
}

function interpolateTrack(
  track: readonly Keyframe[] | undefined,
  time: number,
  duration: number,
) {
  if (!track?.length) {
    return null
  }

  if (track.length === 1) {
    const [, x, y, z] = track[0]
    return { x, y, z }
  }

  for (let index = 0; index < track.length - 1; index += 1) {
    const current = track[index]
    const next = track[index + 1]

    if (time >= current[0] && time <= next[0]) {
      const span = next[0] - current[0]
      const rawProgress = span === 0 ? 0 : (time - current[0]) / span
      const easedProgress = easeInOutSine(rawProgress)

      return {
        x: current[1] + (next[1] - current[1]) * easedProgress,
        y: current[2] + (next[2] - current[2]) * easedProgress,
        z: current[3] + (next[3] - current[3]) * easedProgress,
      }
    }
  }

  const last = track[track.length - 1]
  const first = track[0]
  const wrapSpan = duration - last[0] + first[0]

  if (wrapSpan <= 0) {
    return { x: last[1], y: last[2], z: last[3] }
  }

  const wrappedTime =
    time >= last[0] ? time - last[0] : duration - last[0] + time
  const easedProgress = easeInOutSine(wrappedTime / wrapSpan)

  return {
    x: last[1] + (first[1] - last[1]) * easedProgress,
    y: last[2] + (first[2] - last[2]) * easedProgress,
    z: last[3] + (first[3] - last[3]) * easedProgress,
  }
}

function applyBlockbenchAnimation(
  player: PlayerObject,
  clip: BlockbenchAnimationClip,
  progress: number,
) {
  const time = ((progress % clip.length) + clip.length) % clip.length

  player.resetJoints()

  for (const [boneName, tracks] of Object.entries(clip.bones) as Array<
    [keyof typeof animatedTrackBoneMap, NonNullable<(typeof clip.bones)[TrackBoneName]>]
  >) {
    const targetKey = animatedTrackBoneMap[boneName]
    const target = targetKey === 'player' ? player : player.skin[targetKey]

    const rotation = interpolateTrack(tracks.rotation, time, clip.length)
    if (rotation) {
      target.rotation.copy(
        new Euler(
          (rotation.x * Math.PI) / 180,
          (rotation.y * Math.PI) / 180,
          (rotation.z * Math.PI) / 180,
        ),
      )
    }

    const position = interpolateTrack(tracks.position, time, clip.length)
    if (position) {
      target.position.copy(new Vector3(position.x, position.y, position.z))
    }
  }
}

export function createBlockbenchAnimation(clip: BlockbenchAnimationClip) {
  return new FunctionAnimation((player, progress) => {
    applyBlockbenchAnimation(player, clip, progress)
  })
}
