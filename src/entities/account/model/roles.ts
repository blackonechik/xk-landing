const roleLabels: Record<string, string> = {
  admin: 'Администратор сайта',
  moderator: 'Модератор',
  player: 'Игрок',
}

export function normalizePlayerRoles(
  roles: string[] | null | undefined,
  siteRole?: string | null,
) {
  const normalized = [...(roles ?? []), siteRole]
    .filter((role): role is string => Boolean(role?.trim()))
    .map((role) => role.trim().toLowerCase())

  return Array.from(new Set(normalized.length > 0 ? normalized : ['player']))
}

export function isAdminRole(roles: string[] | null | undefined) {
  return normalizePlayerRoles(roles).includes('admin')
}

export function getRoleLabel(role: string) {
  const normalizedRole = role.trim().toLowerCase()

  return (
    roleLabels[normalizedRole] ??
    normalizedRole.replace(/^./, (char) => char.toUpperCase())
  )
}

export function getPrimaryRole(roles: string[] | null | undefined) {
  const normalizedRoles = normalizePlayerRoles(roles)

  return normalizedRoles.includes('admin') ? 'admin' : normalizedRoles[0]
}

export function getPrimaryRoleLabel(roles: string[] | null | undefined) {
  return getRoleLabel(getPrimaryRole(roles))
}
