import { OverviewSection } from '../sections/OverviewSection'
import { useAdminPageContext } from '../../model/admin-page-context'

export function AdminOverviewRoute() {
  const { dashboard, stats } = useAdminPageContext()

  return <OverviewSection dashboard={dashboard} stats={stats} />
}
