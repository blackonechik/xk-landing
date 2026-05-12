import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  Battery,
  ChevronsDown,
  ChevronsUp,
  Coins,
  Gem,
  Gift,
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
import { PlayerHeadImage } from '@/entities/account'
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

type RewardPop = {
  id: string
  blockId: string
  coins: number
  count: number
  rare: boolean
}

type MineTab = 'mine' | 'pickaxe' | 'energy' | 'rating'

const gridSize = {
  columns: 6,
  rows: 7,
}
const minDepth = 0
const depthStep = 6
const descendCost = 8
const ascendCost = 4
const maxEnergy = 60
const energyRegenSeconds = 180
const soundBase =
  'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/26.1.2/assets/minecraft/sounds'

const mineSounds = {
  break: `${soundBase}/dig/stone2.ogg`,
  click: `${soundBase}/random/click.ogg`,
  energy: `${soundBase}/mob/villager/no1.ogg`,
  hit: `${soundBase}/dig/stone1.ogg`,
  reward: `${soundBase}/random/orb.ogg`,
  upgrade: `${soundBase}/random/levelup.ogg`,
}

const leaderboard = [
  { name: 'Notch', depth: 126, coins: 18420, pickaxe: 'Алмазная' },
  { name: 'jeb_', depth: 114, coins: 15180, pickaxe: 'Золотая' },
  { name: 'Vlad', depth: 96, coins: 12840, pickaxe: 'Железная' },
  { name: 'Dinnerbone', depth: 78, coins: 9340, pickaxe: 'Железная' },
  { name: 'Steve', depth: 54, coins: 7420, pickaxe: 'Каменная' },
]

const energyTasks = [
  { title: 'Зайти на сервер', reward: '+20 энергии', done: false },
  { title: 'Подписаться на Telegram', reward: '+15 энергии', done: false },
  { title: 'Забрать дневной бонус', reward: '+18 энергии', done: true },
  { title: 'Пригласить друга', reward: '+25 энергии', done: false },
]

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
  const [coins, setCoins] = useState(10040)
  const [energy, setEnergy] = useState(37)
  const [energyTimer, setEnergyTimer] = useState(energyRegenSeconds)
  const [depth, setDepth] = useState(12)
  const [tierIndex, setTierIndex] = useState(1)
  const [selectedId, setSelectedId] = useState('12-14')
  const [dailyClaimed, setDailyClaimed] = useState(false)
  const [rewards, setRewards] = useState<Array<Reward>>(initialRewards)
  const [blocks, setBlocks] = useState(() => createMine(12))
  const [hitEffect, setHitEffect] = useState<HitEffect | null>(null)
  const [rewardPop, setRewardPop] = useState<RewardPop | null>(null)
  const [showEnergyModal, setShowEnergyModal] = useState(false)
  const [activeTab, setActiveTab] = useState<MineTab>('mine')

  const pickaxe = pickaxeTiers[tierIndex]
  const intactBlocks = blocks.filter((block) => !block.broken).length
  const nextUpgrade = pickaxe.upgradeCost
  const isEnergyEmpty = energy <= 0
  const nextPickaxeName =
    tierIndex < pickaxeTiers.length - 1
      ? pickaxeTiers[tierIndex + 1].name
      : 'максимум достигнут'

  const energyCountdown = useMemo(() => formatTimer(energyTimer), [energyTimer])

  useEffect(() => {
    if (energy >= maxEnergy) {
      setEnergyTimer(energyRegenSeconds)

      return
    }

    const timerId = window.setInterval(() => {
      setEnergyTimer((current) => {
        if (current > 1) {
          return current - 1
        }

        setEnergy((energyValue) => Math.min(maxEnergy, energyValue + 1))

        return energyRegenSeconds
      })
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [energy])

  const pushReward = (reward: Reward) => {
    setRewards((current) => [reward, ...current].slice(0, 5))
  }

  const mineBlock = (targetId = selectedId) => {
    const target = blocks.find((block) => block.id === targetId)

    if (!target || target.broken) {
      return
    }

    const config = blockConfigs[target.kind]

    if (tierIndex < config.requiredTier) {
      setSelectedId(targetId)
      playMineSound('energy')
      pushReward({
        id: `${target.id}-locked-${Date.now()}`,
        text: `Нужна кирка: ${pickaxeTiers[config.requiredTier].name}`,
      })

      return
    }

    if (energy <= 0) {
      setSelectedId(targetId)
      setShowEnergyModal(true)
      playMineSound('energy')

      return
    }

    setSelectedId(targetId)
    setEnergy((current) => {
      const nextEnergy = Math.max(0, current - 1)

      if (nextEnergy === 0) {
        setShowEnergyModal(true)
      }

      return nextEnergy
    })

    const chanceSeed = target.id.length + target.hp + coins + depth + tierIndex
    const isCrit = chanceSeed % Math.ceil(1 / pickaxe.critChance) === 0
    const damage = pickaxe.damage + (isCrit ? Math.ceil(pickaxe.damage * 0.75) : 0)
    const willBreak = target.hp - damage <= 0

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

    playMineSound(willBreak ? 'break' : 'hit')

    if (willBreak) {
      const isDouble = chanceSeed % Math.ceil(1 / pickaxe.doubleChance) === 1
      const earned = Math.round(config.coins * pickaxe.coinBonus * (isDouble ? 2 : 1))

      setCoins((current) => current + earned)
      playMineSound('reward', 0.55)
      setRewardPop((current) => ({
        id: `${target.id}-${Date.now()}`,
        blockId: target.id,
        coins: earned,
        count: (current?.count ?? 0) + 1,
        rare: ['diamond', 'emerald', 'netherite'].includes(target.kind),
      }))
      pushReward({
        id: `${target.id}-${Date.now()}`,
        text: `+${earned} монет / ${config.resource}${isDouble ? ' x2' : ''}`,
        rare: ['diamond', 'emerald', 'netherite'].includes(target.kind),
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
      playMineSound('energy')

      return
    }

    setCoins((current) => current - nextUpgrade)
    setTierIndex((current) => Math.min(current + 1, pickaxeTiers.length - 1))
    playMineSound('upgrade')
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
      playMineSound('energy')

      return
    }

    setDepth(nextDepth)
    setEnergy((current) => current - cost)
    setBlocks(createMine(nextDepth))
    setSelectedId(`${nextDepth}-14`)
    setActiveTab('mine')
    playMineSound('click')
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
    setShowEnergyModal(false)
    setCoins((current) => current + 220)
    setEnergy((current) => Math.min(maxEnergy, current + 18))
    playMineSound('reward')
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
            <p className="mine-eyebrow">XK HARDCORE</p>
            <h1>Шахта</h1>
          </div>
          <div className="mine-day">
            <Sparkles size={16} />
            Добыча x{pickaxe.coinBonus.toFixed(2)}
          </div>
        </div>

        <div className="mine-stats">
          <Stat
            active={activeTab === 'mine'}
            icon={<AssetIcon alt="" className="mine-stat__asset" src={blockConfigs.diamond.itemIcon} />}
            label="Шахта"
            onClick={() => {
              setActiveTab('mine')
              playMineSound('click', 0.45)
            }}
            value={`${depth} м`}
          />
          <Stat
            active={activeTab === 'energy'}
            hint="+1 энергия / 3 мин"
            icon={<AssetIcon alt="" className="mine-stat__asset" src={blockConfigs.redstone.itemIcon} />}
            label="Энергия"
            onClick={() => {
              setActiveTab('energy')
              playMineSound('click', 0.45)
            }}
            tone={isEnergyEmpty ? 'danger' : undefined}
            value={`${energy}/${maxEnergy}`}
          />
          <Stat
            active={activeTab === 'pickaxe'}
            icon={<AssetIcon alt="" className="mine-stat__asset" src={pickaxe.icon} />}
            label="Кирка"
            onClick={() => {
              setActiveTab('pickaxe')
              playMineSound('click', 0.45)
            }}
            value={pickaxe.name}
          />
          <Stat
            active={activeTab === 'rating'}
            icon={<AssetIcon alt="" className="mine-stat__asset" src={blockConfigs.emerald.itemIcon} />}
            label="Рейтинг"
            onClick={() => {
              setActiveTab('rating')
              playMineSound('click', 0.45)
            }}
            value="#3"
          />
        </div>

        {activeTab === 'mine' ? (
          <MineBoard
            blocks={blocks}
            depth={depth}
            energy={energy}
            hitEffect={hitEffect}
            mineBlock={mineBlock}
            moveDepth={moveDepth}
            coins={coins}
            nextUpgrade={nextUpgrade}
            pickaxeIcon={pickaxe.icon}
            pickaxeTierIndex={tierIndex}
            rewards={rewards}
            rewardPop={rewardPop}
            selectedId={selectedId}
            upgradePickaxe={upgradePickaxe}
          />
        ) : null}

        {activeTab === 'pickaxe' ? (
          <PickaxePage
            coins={coins}
            nextPickaxeName={nextPickaxeName}
            nextUpgrade={nextUpgrade}
            pickaxe={pickaxe}
            upgradePickaxe={upgradePickaxe}
          />
        ) : null}

        {activeTab === 'energy' ? (
          <EnergyPage
            claimDaily={claimDaily}
            dailyClaimed={dailyClaimed}
            energy={energy}
            energyCountdown={energyCountdown}
          />
        ) : null}

        {activeTab === 'rating' ? <RatingPage /> : null}

        {showEnergyModal ? (
          <div
            aria-labelledby="mine-energy-modal-title"
            aria-modal="true"
            className="mine-modal-backdrop"
            role="dialog"
          >
            <div className="mine-modal">
              <div className="mine-modal__gem">
                <AssetIcon alt="" src={blockConfigs.redstone.itemIcon} />
              </div>
              <h2 id="mine-energy-modal-title">Энергия закончилась</h2>
              <p>
                Шахтеру нужен отдых. Следующая энергия восстановится через
                <strong> {energyCountdown}</strong>.
              </p>
              <div className="mine-modal__actions">
                <button
                  className="mine-modal-button mine-modal-button_primary"
                  onClick={claimDaily}
                  disabled={dailyClaimed}
                  type="button"
                >
                  <Gift size={18} />
                  {dailyClaimed ? 'Бонус уже получен' : 'Забрать дневной бонус'}
                </button>
                <button
                  className="mine-modal-button"
                  onClick={() => setShowEnergyModal(false)}
                  type="button"
                >
                  Понятно
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  )
}

function MineBoard({
  blocks,
  coins,
  depth,
  energy,
  hitEffect,
  mineBlock,
  moveDepth,
  nextUpgrade,
  pickaxeIcon,
  pickaxeTierIndex,
  rewards,
  rewardPop,
  selectedId,
  upgradePickaxe,
}: {
  blocks: Array<MineBlock>
  coins: number
  depth: number
  energy: number
  hitEffect: HitEffect | null
  mineBlock: (targetId?: string) => void
  moveDepth: (direction: 'up' | 'down') => void
  nextUpgrade: number | null
  pickaxeIcon: string
  pickaxeTierIndex: number
  rewards: Array<Reward>
  rewardPop: RewardPop | null
  selectedId: string
  upgradePickaxe: () => void
}) {
  const intactBlocks = blocks.filter((block) => !block.broken).length

  return (
    <>
      <section className="mine-balance-panel">
        <Coins size={20} />
        <span>Баланс</span>
        <strong>{coins.toLocaleString('ru-RU')} монет</strong>
      </section>

      <section className="mine-board-panel">
        <div className="mine-board-head">
          <span>Разрез шахты · {depth} м</span>
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
            const canMine = pickaxeTierIndex >= config.requiredTier
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
                  selectedId === block.id && !block.broken ? 'mine-block_selected' : '',
                  hitEffect?.id === block.id ? 'mine-block_hit' : '',
                  hitEffect?.id === block.id && hitEffect.crit ? 'mine-block_crit' : '',
                  block.broken ? 'mine-block_broken' : '',
                  !canMine && !block.broken ? 'mine-block_locked' : '',
                  damageStage !== null && !block.broken ? 'mine-block_damaged' : '',
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
                {!canMine && !block.broken ? (
                  <span className="mine-block__lock" aria-hidden="true" />
                ) : null}
                {damageStage !== null ? <span className="mine-block__break" /> : null}
                {hitEffect?.id === block.id ? (
                  <>
                    <img
                      alt=""
                      className="mine-hit-pickaxe"
                      key={`pickaxe-${hitEffect.id}-${hitEffect.count}`}
                      src={pickaxeIcon}
                    />
                    <span
                      className="mine-hit-sparks"
                      key={`sparks-${hitEffect.id}-${hitEffect.count}`}
                    />
                  </>
                ) : null}
                {rewardPop?.blockId === block.id ? (
                  <span
                    className={
                      rewardPop.rare
                        ? 'mine-reward-pop mine-reward-pop_rare'
                        : 'mine-reward-pop'
                    }
                    key={`reward-${rewardPop.id}-${rewardPop.count}`}
                  >
                    +{rewardPop.coins}
                  </span>
                ) : null}
                <span className="mine-block__hp">
                  {block.broken ? ' ' : `${block.hp}/${block.maxHp}`}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="mine-actions">
        <button
          className="mine-button mine-button_primary"
          disabled={nextUpgrade === null || coins < nextUpgrade}
          onClick={upgradePickaxe}
          type="button"
        >
          <AssetIcon alt="" className="mine-button__asset" src={pickaxeIcon} />
          {nextUpgrade === null
            ? 'Максимальная кирка'
            : `Улучшить кирку · ${nextUpgrade} монет`}
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
        <button
          className="mine-button"
          disabled={energy < descendCost}
          onClick={() => moveDepth('down')}
          type="button"
        >
          <ChevronsDown size={18} />
          Спуститься глубже
        </button>
      </section>

    </>
  )
}

function PickaxePage({
  coins,
  nextPickaxeName,
  nextUpgrade,
  pickaxe,
  upgradePickaxe,
}: {
  coins: number
  nextPickaxeName: string
  nextUpgrade: number | null
  pickaxe: (typeof pickaxeTiers)[number]
  upgradePickaxe: () => void
}) {
  return (
    <section className="mine-subpage">
      <div className="mine-subpage-title">Кирка</div>
      <div className="mine-pickaxe-panel">
        <div className="mine-pickaxe-rank" style={{ color: pickaxe.color }}>
          <img alt="" src={pickaxe.icon} />
          <small>{pickaxe.material}</small>
        </div>
        <div>
          <span>Уровень кирки</span>
          <strong>{pickaxe.name}</strong>
          <p className="mine-next-pickaxe">Следующая: {nextPickaxeName}</p>
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
      </div>
      <button
        className="mine-button mine-button_primary"
        disabled={nextUpgrade === null || coins < nextUpgrade}
        onClick={upgradePickaxe}
        type="button"
      >
        <AssetIcon alt="" className="mine-button__asset" src={pickaxe.icon} />
        {nextUpgrade === null
          ? 'Максимальная кирка'
          : `Улучшить кирку · ${nextUpgrade} монет`}
      </button>
    </section>
  )
}

function EnergyPage({
  claimDaily,
  dailyClaimed,
  energy,
  energyCountdown,
}: {
  claimDaily: () => void
  dailyClaimed: boolean
  energy: number
  energyCountdown: string
}) {
  return (
    <section className="mine-subpage">
      <div className="mine-subpage-title">Энергия</div>
      <div className="mine-energy-card">
        <Battery size={20} />
        <span>{energy}/{maxEnergy}</span>
        <strong>+1 энергия каждые 3 минуты</strong>
        <small>Следующая энергия через {energyCountdown}</small>
      </div>
      <div className="mine-task-list">
        {energyTasks.map((task) => (
          <div className="mine-task" key={task.title}>
            <span>{task.title}</span>
            <strong>{task.done ? 'Получено' : task.reward}</strong>
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
  )
}

function RatingPage() {
  return (
    <section className="mine-subpage">
      <div className="mine-subpage-title">Рейтинг</div>
      <div className="mine-leaderboard">
        {leaderboard.map((player, index) => (
          <div
            className={player.name === 'Vlad' ? 'mine-leader mine-leader_self' : 'mine-leader'}
            key={player.name}
          >
            <span>#{index + 1}</span>
            <PlayerHeadImage
              alt=""
              className="mine-leader__avatar"
              nickname={player.name}
            />
            <strong>{player.name}</strong>
            <small>
              {player.depth} м · {player.coins.toLocaleString('ru-RU')} монет · {player.pickaxe}
            </small>
          </div>
        ))}
      </div>
    </section>
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
  active,
  hint,
  icon,
  label,
  onClick,
  tone,
  value,
}: {
  active?: boolean
  hint?: string
  icon: ReactNode
  label: string
  onClick?: () => void
  tone?: 'danger'
  value: string
}) {
  const className = [
    'mine-stat',
    tone === 'danger' ? 'mine-stat_danger' : '',
    active ? 'mine-stat_active' : '',
  ].join(' ')

  return (
    <button className={className} onClick={onClick} type="button">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
      {hint ? <small>{hint}</small> : null}
    </button>
  )
}

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function playMineSound(name: keyof typeof mineSounds, volume = 0.38) {
  if (typeof window === 'undefined') {
    return
  }

  const audio = new Audio(mineSounds[name])
  audio.volume = volume
  void audio.play().catch(() => undefined)
}
