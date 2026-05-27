import { PaymentsSection } from '../sections/PaymentsSection'
import { useAdminPageContext } from '../../model/admin-page-context'

export function AdminPaymentsRoute() {
  const { dashboard } = useAdminPageContext()

  return <PaymentsSection payments={dashboard?.payments ?? []} />
}
