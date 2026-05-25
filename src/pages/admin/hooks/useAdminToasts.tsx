import { toast } from '@heroui/react'
import { CheckCircle2, Info, TriangleAlert } from 'lucide-react'

export function useAdminToasts() {
  function showErrorToast(message: string, description?: string) {
    toast.danger(message, {
      description,
      indicator: <TriangleAlert size={16} />,
    })
  }

  function showSuccessToast(message: string, description?: string) {
    toast.success(message, {
      description,
      indicator: <CheckCircle2 size={16} />,
    })
  }

  function showInfoToast(message: string, description?: string) {
    toast.info(message, {
      description,
      indicator: <Info size={16} />,
    })
  }

  return {
    showErrorToast,
    showSuccessToast,
    showInfoToast,
  }
}
