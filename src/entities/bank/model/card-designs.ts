export type BankCardDesign = {
  id: string
  title: string
  mark: string
  asset: string
}

export const cardDesigns = [
  {
    id: 'creeper',
    title: 'Крипер',
    mark: 'CR',
    asset: '/assets/img/bank/mobs/creeper.png',
  },
  {
    id: 'panda',
    title: 'Панда',
    mark: 'PA',
    asset: '/assets/img/bank/mobs/panda.png',
  },
  {
    id: 'warden',
    title: 'Варден',
    mark: 'WA',
    asset: '/assets/img/bank/mobs/warden.png',
  },
  {
    id: 'enderman',
    title: 'Эндермен',
    mark: 'EN',
    asset: '/assets/img/bank/mobs/enderman.png',
  },
  {
    id: 'fox',
    title: 'Лиса',
    mark: 'FX',
    asset: '/assets/img/bank/mobs/fox.jpg',
  },
  {
    id: 'bee',
    title: 'Пчела',
    mark: 'BE',
    asset: '/assets/img/bank/mobs/bee.jpg',
  },
  {
    id: 'axolotl',
    title: 'Аксолотль',
    mark: 'AX',
    asset: '/assets/img/bank/mobs/axolotl.png',
  },
  {
    id: 'skeleton',
    title: 'Скелет',
    mark: 'SK',
    asset: '/assets/img/bank/mobs/skeleton.png',
  },
] satisfies BankCardDesign[]

export function getCardDesign(designId: string) {
  return cardDesigns.find((design) => design.id === designId) ?? cardDesigns[0]
}
