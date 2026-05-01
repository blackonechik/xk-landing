export type BlockKind =
  | 'stone'
  | 'dirt'
  | 'coal'
  | 'iron'
  | 'copper'
  | 'gold'
  | 'redstone'
  | 'lapis'
  | 'diamond'
  | 'emerald'
  | 'obsidian'
  | 'netherite'

export type PickaxeTier = {
  name: string
  material: string
  icon: string
  damage: number
  coinBonus: number
  critChance: number
  doubleChance: number
  upgradeCost: number | null
  color: string
}

export type BlockConfig = {
  kind: BlockKind
  name: string
  texture: string
  itemIcon: string
  hardness: number
  requiredTier: number
  coins: number
  resource: string
  rarity: number
}

const textureBase =
  'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/26.1.2/assets/minecraft/textures'
const blockTextureBase = `${textureBase}/block`
const itemTextureBase = `${textureBase}/item`

export const destroyStageTextures = Array.from(
  { length: 10 },
  (_, index) => `${blockTextureBase}/destroy_stage_${index}.png`,
)

export const pickaxeTiers: Array<PickaxeTier> = [
  {
    name: 'Деревянная',
    material: 'I',
    icon: `${itemTextureBase}/wooden_pickaxe.png`,
    damage: 1,
    coinBonus: 1,
    critChance: 0.04,
    doubleChance: 0.02,
    upgradeCost: 120,
    color: '#c89148',
  },
  {
    name: 'Каменная',
    material: 'II',
    icon: `${itemTextureBase}/stone_pickaxe.png`,
    damage: 2,
    coinBonus: 1.15,
    critChance: 0.07,
    doubleChance: 0.04,
    upgradeCost: 360,
    color: '#aeb2b4',
  },
  {
    name: 'Железная',
    material: 'III',
    icon: `${itemTextureBase}/iron_pickaxe.png`,
    damage: 3,
    coinBonus: 1.35,
    critChance: 0.1,
    doubleChance: 0.07,
    upgradeCost: 820,
    color: '#e8eef0',
  },
  {
    name: 'Золотая',
    material: 'IV',
    icon: `${itemTextureBase}/golden_pickaxe.png`,
    damage: 4,
    coinBonus: 1.65,
    critChance: 0.14,
    doubleChance: 0.1,
    upgradeCost: 1550,
    color: '#ffd35a',
  },
  {
    name: 'Алмазная',
    material: 'V',
    icon: `${itemTextureBase}/diamond_pickaxe.png`,
    damage: 6,
    coinBonus: 2.1,
    critChance: 0.2,
    doubleChance: 0.15,
    upgradeCost: 3200,
    color: '#56f1ff',
  },
  {
    name: 'Незеритовая',
    material: 'VI',
    icon: `${itemTextureBase}/netherite_pickaxe.png`,
    damage: 9,
    coinBonus: 2.8,
    critChance: 0.28,
    doubleChance: 0.22,
    upgradeCost: null,
    color: '#6c5d67',
  },
]

export const blockConfigs: Record<BlockKind, BlockConfig> = {
  stone: {
    kind: 'stone',
    name: 'Камень',
    texture: `${blockTextureBase}/stone.png`,
    itemIcon: `${blockTextureBase}/cobblestone.png`,
    hardness: 2,
    requiredTier: 0,
    coins: 6,
    resource: 'булыжник',
    rarity: 42,
  },
  dirt: {
    kind: 'dirt',
    name: 'Земля',
    texture: `${blockTextureBase}/dirt.png`,
    itemIcon: `${blockTextureBase}/dirt.png`,
    hardness: 1,
    requiredTier: 0,
    coins: 3,
    resource: 'земля',
    rarity: 30,
  },
  coal: {
    kind: 'coal',
    name: 'Угольная руда',
    texture: `${blockTextureBase}/coal_ore.png`,
    itemIcon: `${itemTextureBase}/coal.png`,
    hardness: 3,
    requiredTier: 0,
    coins: 14,
    resource: 'уголь',
    rarity: 16,
  },
  iron: {
    kind: 'iron',
    name: 'Железная руда',
    texture: `${blockTextureBase}/iron_ore.png`,
    itemIcon: `${itemTextureBase}/raw_iron.png`,
    hardness: 5,
    requiredTier: 1,
    coins: 24,
    resource: 'железо',
    rarity: 10,
  },
  copper: {
    kind: 'copper',
    name: 'Медная руда',
    texture: `${blockTextureBase}/copper_ore.png`,
    itemIcon: `${itemTextureBase}/raw_copper.png`,
    hardness: 4,
    requiredTier: 1,
    coins: 18,
    resource: 'медь',
    rarity: 12,
  },
  gold: {
    kind: 'gold',
    name: 'Золотая руда',
    texture: `${blockTextureBase}/gold_ore.png`,
    itemIcon: `${itemTextureBase}/raw_gold.png`,
    hardness: 6,
    requiredTier: 2,
    coins: 44,
    resource: 'золото',
    rarity: 5,
  },
  redstone: {
    kind: 'redstone',
    name: 'Редстоун',
    texture: `${blockTextureBase}/redstone_ore.png`,
    itemIcon: `${itemTextureBase}/redstone.png`,
    hardness: 6,
    requiredTier: 2,
    coins: 52,
    resource: 'редстоун',
    rarity: 4,
  },
  lapis: {
    kind: 'lapis',
    name: 'Лазурит',
    texture: `${blockTextureBase}/lapis_ore.png`,
    itemIcon: `${blockTextureBase}/lapis_ore.png`,
    hardness: 6,
    requiredTier: 1,
    coins: 58,
    resource: 'лазурит',
    rarity: 3,
  },
  diamond: {
    kind: 'diamond',
    name: 'Алмазная руда',
    texture: `${blockTextureBase}/diamond_ore.png`,
    itemIcon: `${itemTextureBase}/diamond.png`,
    hardness: 9,
    requiredTier: 2,
    coins: 118,
    resource: 'алмаз',
    rarity: 2,
  },
  emerald: {
    kind: 'emerald',
    name: 'Изумрудная руда',
    texture: `${blockTextureBase}/emerald_ore.png`,
    itemIcon: `${itemTextureBase}/emerald.png`,
    hardness: 9,
    requiredTier: 2,
    coins: 146,
    resource: 'изумруд',
    rarity: 1,
  },
  obsidian: {
    kind: 'obsidian',
    name: 'Обсидиан',
    texture: `${blockTextureBase}/obsidian.png`,
    itemIcon: `${blockTextureBase}/obsidian.png`,
    hardness: 16,
    requiredTier: 4,
    coins: 90,
    resource: 'обсидиан',
    rarity: 2,
  },
  netherite: {
    kind: 'netherite',
    name: 'Незеритовая руда',
    texture: `${blockTextureBase}/ancient_debris_side.png`,
    itemIcon: `${itemTextureBase}/netherite_scrap.png`,
    hardness: 22,
    requiredTier: 4,
    coins: 190,
    resource: 'незерит',
    rarity: 1,
  },
}

export const weightedBlocks = Object.values(blockConfigs).flatMap((block) =>
  Array.from({ length: block.rarity }, () => block.kind),
)
