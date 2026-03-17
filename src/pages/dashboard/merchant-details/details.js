import { Helmet } from 'react-helmet-async';
// sections
import MerchantDetailsView from 'src/sections/merchant-details/view/merchant-details-view';

// ----------------------------------------------------------------------

export default function MerchantDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Merchant Details</title>
      </Helmet>

      <MerchantDetailsView />
    </>
  );
}
