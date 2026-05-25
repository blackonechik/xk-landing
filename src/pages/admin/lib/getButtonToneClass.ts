export function getButtonToneClass(
  tone: 'default' | 'danger' | 'success' | 'warning' | 'accent' = 'default',
) {
  switch (tone) {
    case 'danger':
      return 'bg-danger text-danger-foreground hover:bg-danger/90'
    case 'success':
      return 'bg-success text-success-foreground hover:bg-success/90'
    case 'warning':
      return 'bg-warning text-warning-foreground hover:bg-warning/90'
    case 'accent':
      return 'bg-accent text-accent-foreground hover:bg-accent/90'
    default:
      return ''
  }
}
