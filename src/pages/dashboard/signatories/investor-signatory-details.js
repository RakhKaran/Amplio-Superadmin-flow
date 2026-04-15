import { Helmet } from 'react-helmet-async';

import { InvestorSignatoiresDetailsView } from 'src/sections/investor-profiles/view';

// ----------------------------------------------------------------------

export default function InvestorSignatoryDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Analytics</title>
      </Helmet>

      <InvestorSignatoiresDetailsView />
    </>
  );
}
