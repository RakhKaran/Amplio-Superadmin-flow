import { Helmet } from 'react-helmet-async';
// sections
import EscrowOperationsView from 'src/sections/escrow-operations/view/escrow-operations-view';

// ----------------------------------------------------------------------

export default function EscrowOperationsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Escrow Operations</title>
      </Helmet>

      <EscrowOperationsView />
    </>
  );
}
