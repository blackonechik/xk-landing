import type { CSSProperties, ReactNode } from 'react'
import { useMemo, useState } from 'react'
import {
  Battery,
  ChevronsDown,
  ChevronsUp,
  Coins,
  Gem,
  Gift,
  Hammer,
  Pickaxe,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react'
import {
  blockConfigs,
  destroyStageTextures,
  pickaxeTiers,
  weightedBlocks,
} from '../model/mineConfig'
import type { BlockKind } from '../model/mineConfig'
import './MinePage.css'

type MineBlock = {
  id: string
  kind: BlockKind
  hp: number
  maxHp: number
  broken: boolean
  lastHit: number
}

type Reward = {
  id: string
  text: string
  rare?: boolean
}

type HitEffect = {
  id: string
  count: number
  crit: boolean
}

const gridSize = {
  columns: 6,
  rows: 7,
}
const minDepth = 0
const depthStep = 6
const descendCost = 8
const ascendCost = 4

const seededIndex = (seed: number, index: number, salt = 0) => {
  const value = Math.sin(seed * 42.7 + index * 19.13 + salt * 7.77) * 10000

  return Math.abs(Math.floor(value)) % weightedBlocks.length
}

function createMine(depth: number): Array<MineBlock> {
  return Array.from({ length: gridSize.columns * gridSize.rows }, (_, index) => {
    const kind = weightedBlocks[seededIndex(depth, index, depth % 9)]
    const config = blockConfigs[kind]
    const depthBonus = Math.floor(depth / 3)

    return {
      id: `${depth}-${index}`,
      kind,
      hp: config.hardness + depthBonus,
      maxHp: config.hardness + depthBonus,
      broken: false,
      lastHit: 0,
    }
  })
}

const initialRewards: Array<Reward> = [
  { id: 'start-1', text: '+34 монеты / уголь' },
  { id: 'start-2', text: '+18 монет / медь' },
  { id: 'start-3', text: '+6 монет / булыжник' },
]

export function MinePage() {
  const [coins, setCoins] = useState(640)
  const [energy, setEnergy] = useState(37)
  const [depth, setDepth] = useState(12)
  const [tierIndex, setTierIndex] = useState(1)
  const [selectedId, setSelectedId] = useState('12-14')
  const [dailyClaimed, setDailyClaimed] = useState(false)
  const [rewards, setRewards] = useState<Array<Reward>>(initialRewards)
  const [blocks, setBlocks] = useState(() => createMine(12))
  const [hitEffect, setHitEffect] = useState<HitEffect | null>(null)

  const pickaxe = pickaxeTiers[tierIndex]
  const selectedBlock = blocks.find((block) => block.id === selectedId) ?? blocks[0]
  const selectedConfig = blockConfigs[selectedBlock.kind]
  const intactBlocks = blocks.filter((block) => !block.broken).length
  const nextUpgrade = pickaxe.upgradeCost

  const depthLabel = useMemo(() => `${depth} м`, [depth])

  const pushReward = (reward: Reward) => {
    setRewards((current) => [reward, ...current].slice(0, 5))
  }

  const mineBlock = (targetId = selectedId) => {
    const target = blocks.find((block) => block.id === targetId)

    if (!target || target.broken || energy <= 0) {
      return
    }

    setSelectedId(targetId)
    setEnergy((current) => Math.max(0, current - 1))

    const chanceSeed = target.id.length + target.hp + coins + depth + tierIndex
    const isCrit = chanceSeed % Math.ceil(1 / pickaxe.critChance) === 0
    const damage = pickaxe.damage + (isCrit ? Math.ceil(pickaxe.damage * 0.75) : 0)

    setHitEffect((current) => ({
      id: targetId,
      count: (current?.count ?? 0) + 1,
      crit: isCrit,
    }))

    setBlocks((current) =>
      current.map((block) => {
        if (block.id !== targetId) {
          return block
        }

        const nextHp = Math.max(0, block.hp - damage)

        return {
          ...block,
          hp: nextHp,
          broken: nextHp === 0,
          lastHit: block.lastHit + 1,
        }
      }),
    )

    if (target.hp - damage <= 0) {
      const config = blockConfigs[target.kind]
      const isDouble = chanceSeed % Math.ceil(1 / pickaxe.doubleChance) === 1
      const earned = Math.round(config.coins * pickaxe.coinBonus * (isDouble ? 2 : 1))

      setCoins((current) => current + earned)
      pushReward({
        id: `${target.id}-${Date.now()}`,
        text: `+${earned} монет / ${config.resource}${isDouble ? ' x2' : ''}`,
        rare: ['diamond', 'emerald', 'chest'].includes(target.kind),
      })
    } else if (isCrit) {
      pushReward({
        id: `${target.id}-crit-${Date.now()}`,
        text: `Критический удар: -${damage} прочности`,
        rare: true,
      })
    }
  }

  const upgradePickaxe = () => {
    if (nextUpgrade === null || coins < nextUpgrade) {
      return
    }

    setCoins((current) => current - nextUpgrade)
    setTierIndex((current) => Math.min(current + 1, pickaxeTiers.length - 1))
    pushReward({
      id: `upgrade-${Date.now()}`,
      text: `Кирка улучшена: ${pickaxeTiers[tierIndex + 1].name}`,
      rare: true,
    })
  }

  const moveDepth = (direction: 'up' | 'down') => {
    const cost = direction === 'down' ? descendCost : ascendCost
    const nextDepth =
      direction === 'down'
        ? depth + depthStep
        : Math.max(minDepth, depth - depthStep)

    if (energy < cost || nextDepth === depth) {
      return
    }

    setDepth(nextDepth)
    setEnergy((current) => current - cost)
    setBlocks(createMine(nextDepth))
    setSelectedId(`${nextDepth}-14`)
    pushReward({
      id: `depth-${Date.now()}`,
      text:
        direction === 'down'
          ? `Глубже: ${nextDepth} м`
          : `Выше: ${nextDepth} м`,
    })
  }

  const claimDaily = () => {
    if (dailyClaimed) {
      return
    }

    setDailyClaimed(true)
    setCoins((current) => current + 220)
    setEnergy((current) => Math.min(60, current + 18))
    pushReward({
      id: `daily-${Date.now()}`,
      text: '+220 монет / +18 энергии',
      rare: true,
    })
  }

  return (
    <main className="mine-app">
      <section className="mine-shell" aria-label="Шахта">
        <div className="mine-topbar">
          <div>
            <p className="mine-eyebrow">Telegram WebApp</p>
            <h1>Шахта</h1>
          </div>
          <div className="mine-day">
            <Sparkles size={16} />
            Добыча x{pickaxe.coinBonus.toFixed(2)}
          </div>
        </div>

        <div className="mine-stats">
          <Stat icon={<Coins size={18} />} label="Баланс" value={coins.toLocaleString('ru-RU')} />
          <Stat icon={<Battery size={18} />} label="Энергия" value={`${energy}/60`} />
          <Stat
            icon={<AssetIcon alt="" className="mine-stat__asset" src={pickaxe.icon} />}
            label="Кирка"
            value={pickaxe.name}
          />
          <Stat icon={<ChevronsDown size={18} />} label="Глубина" value={depthLabel} />
        </div>

        <section className="mine-board-panel">
          <div className="mine-board-head">
            <span>Разрез шахты</span>
            <strong>{intactBlocks}/42 блоков</strong>
          </div>

          <div
            className="mine-grid"
            style={{
              gridTemplateColumns: `repeat(${gridSize.columns}, minmax(0, 1fr))`,
            }}
          >
            {blocks.map((block) => {
              const config = blockConfigs[block.kind]
              const damageLevel = 1 - block.hp / block.maxHp
              const damageStage =
                damageLevel > 0
                  ? Math.min(9, Math.max(0, Math.floor(damageLevel * 10)))
                  : null

              return (
                <button
                  aria-label={`${config.name}, прочность ${block.hp}`}
                  className={[
                    'mine-block',
                    selectedId === block.id ? 'mine-block_selected' : '',
                    hitEffect?.id === block.id ? 'mine-block_hit' : '',
                    hitEffect?.id === block.id && hitEffect.crit ? 'mine-block_crit' : '',
                    block.broken ? 'mine-block_broken' : '',
                    damageStage !== null ? 'mine-block_damaged' : '',
                  ].join(' ')}
                  key={`${block.id}-${block.lastHit}`}
                  onClick={() => mineBlock(block.id)}
                  style={
                    {
                      '--block-texture': `url("${config.texture}")`,
                      '--break-texture':
                        damageStage === null
                          ? 'none'
                          : `url("${destroyStageTextures[damageStage]}")`,
                      '--hit-count': block.lastHit,
                    } as CSSProperties
                  }
                  type="button"
                >
                  <span className="mine-block__shine" />
                  {damageStage !== null ? <span className="mine-block__break" /> : null}
                  {hitEffect?.id === block.id ? (
                    <>
                      <img
                        alt=""
                        className="mine-hit-pickaxe"
                        key={`pickaxe-${hitEffect.id}-${hitEffect.count}`}
                        src={pickaxe.icon}
                      />
                      <span
                        className="mine-hit-sparks"
                        key={`sparks-${hitEffect.id}-${hitEffect.count}`}
                      />
                    </>
                  ) : null}
                  <span className="mine-block__hp">
                    {block.broken ? ' ' : `${block.hp}/${block.maxHp}`}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="mine-selected">
          <div
            className="mine-selected__texture"
            style={{
              backgroundImage: `url("${selectedConfig.texture}")`,
            }}
          />
          <div className="mine-selected__content">
            <span>Выбранный блок</span>
            <strong>{selectedConfig.name}</strong>
            <div className="mine-progress" aria-label="Прочность блока">
              <i
                style={{
                  width: `${Math.max(0, (selectedBlock.hp / selectedBlock.maxHp) * 100)}%`,
                }}
              />
            </div>
            <small>
              Прочность {selectedBlock.hp}/{selectedBlock.maxHp} · награда ~
              {Math.round(selectedConfig.coins * pickaxe.coinBonus)}
            </small>
            <div className="mine-resource-preview">
              <AssetIcon alt="" src={selectedConfig.itemIcon} />
              <span>{selectedConfig.resource}</span>
            </div>
          </div>
        </section>

        <section className="mine-actions">
          <button className="mine-button mine-button_primary" onClick={() => mineBlock()} type="button">
            <Hammer size={18} />
            Ударить киркой
          </button>
          <button
            className="mine-button"
            disabled={nextUpgrade === null || coins < nextUpgrade}
            onClick={upgradePickaxe}
            type="button"
          >
            <Pickaxe size={18} />
            {nextUpgrade === null ? 'Макс. кирка' : `Улучшить · ${nextUpgrade}`}
          </button>
          <button
            className="mine-button"
            disabled={depth <= minDepth || energy < ascendCost}
            onClick={() => moveDepth('up')}
            type="button"
          >
            <ChevronsUp size={18} />
            Подняться выше
          </button>
          <button className="mine-button" disabled={energy < descendCost} onClick={() => moveDepth('down')} type="button">
            <ChevronsDown size={18} />
            Спуститься глубже
          </button>
        </section>

        <section className="mine-pickaxe-panel">
          <div className="mine-pickaxe-rank" style={{ color: pickaxe.color }}>
            <img alt="" src={pickaxe.icon} />
            <small>{pickaxe.material}</small>
          </div>
          <div>
            <span>Уровень кирки</span>
            <strong>{pickaxe.name}</strong>
            <div className="mine-perks">
              <span>
                <Zap size={14} /> Урон {pickaxe.damage}
              </span>
              <span>
                <Trophy size={14} /> Крит {Math.round(pickaxe.critChance * 100)}%
              </span>
              <span>
                <Gem size={14} /> x2 {Math.round(pickaxe.doubleChance * 100)}%
              </span>
            </div>
          </div>
        </section>

        <section className="mine-assets-panel" aria-label="Добыча">
          {Object.values(blockConfigs)
            .filter((block) => block.kind !== 'stone' && block.kind !== 'dirt')
            .slice(0, 10)
            .map((block) => (
              <div className="mine-asset-cell" key={block.kind}>
                <AssetIcon alt="" src={block.itemIcon} />
              </div>
            ))}
        </section>

        <section className="mine-bottom">
          <div className="mine-rewards">
            <div className="mine-section-title">Последние награды</div>
            {rewards.map((reward) => (
              <div className={reward.rare ? 'mine-reward mine-reward_rare' : 'mine-reward'} key={reward.id}>
                <span />
                {reward.text}
              </div>
            ))}
          </div>

          <button
            className={dailyClaimed ? 'mine-daily mine-daily_claimed' : 'mine-daily'}
            onClick={claimDaily}
            type="button"
          >
            <Gift size={22} />
            <span>
              <strong>{dailyClaimed ? 'Бонус получен' : 'Дневной бонус'}</strong>
              <small>{dailyClaimed ? 'Возвращайся завтра' : '+220 монет и +18 энергии'}</small>
            </span>
          </button>
        </section>
      </section>
    </main>
  )
}

function AssetIcon({
  alt,
  className,
  src,
}: {
  alt: string
  className?: string
  src: string
}) {
  return <img alt={alt} className={className ?? 'mine-asset-icon'} src={src} />
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="mine-stat">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
