import { Helmet } from 'react-helmet-async';
import { AccountView } from 'src/sections/account/view';
import InvestorProfilesDetailsView from 'src/sections/investor-profiles/view/investor-profiles-details-view';
// sections



// ----------------------------------------------------------------------

export default function InvestorProfliesDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Details </title>
      </Helmet>

      {/* <UserProfileView /> */}
     <InvestorProfilesDetailsView/>
    </>
  );
}
