import { Helmet } from 'react-helmet-async';
// sections
import MerchantDetailsPSPBankingView from 'src/sections/merchant-details/view/merchant-details-psp-banking-view';

// ----------------------------------------------------------------------

export default function MerchantDetailsPSPBankingPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Merchant PSP & Banking</title>
      </Helmet>

      <MerchantDetailsPSPBankingView />
    </>
  );
}
