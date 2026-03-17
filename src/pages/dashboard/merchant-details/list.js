import { Helmet } from 'react-helmet-async';
// sections
import MerchantDetailsListView from 'src/sections/merchant-details/view/merchant-details-list-view';

// ----------------------------------------------------------------------

export default function MerchantDetailsListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Merchant Details List</title>
      </Helmet>

      <MerchantDetailsListView />
    </>
  );
}
