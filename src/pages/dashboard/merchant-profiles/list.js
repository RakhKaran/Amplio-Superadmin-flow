import { Helmet } from 'react-helmet-async';
// sections
import { MerchantProfileListView } from 'src/sections/merchant-profiles/view/merchant-profile-list/view';

// ----------------------------------------------------------------------

export default function MerchantProfliesListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Merchant Profiles List</title>
      </Helmet>

      <MerchantProfileListView />
    </>
  );
}
