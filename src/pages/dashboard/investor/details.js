import { Helmet } from 'react-helmet-async';
import { AccountView } from 'src/sections/account/view';
import InvestorDetailsView from 'src/sections/investor/view/investor-details-view';
// sections



// ----------------------------------------------------------------------

export default function InvestorDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Details </title>
      </Helmet>

      {/* <UserProfileView /> */}
     <InvestorDetailsView/>
    </>
  );
}
