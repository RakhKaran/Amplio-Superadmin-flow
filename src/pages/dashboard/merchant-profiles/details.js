import { Helmet } from 'react-helmet-async';
// sections
import { MerchantProfilesDetailsView } from 'src/sections/merchant-profiles/view';

// ----------------------------------------------------------------------

export default function MerchantProfliesDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Details </title>
      </Helmet>

      {/* <UserProfileView /> */}
      <MerchantProfilesDetailsView />
    </>
  );
}
