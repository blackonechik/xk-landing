import { LogOut } from 'lucide-react'

type LogoutButtonProps = {
  icon?: boolean
  onLogout: () => Promise<void>
}

export function LogoutButton({ icon = false, onLogout }: LogoutButtonProps) {
  return (
    <button
      className="xk-cabinet-logout"
      type="button"
      onClick={() => void onLogout()}
    >
      {icon ? <LogOut size={18} /> : null}
      Выйти
    </button>
  )
}
