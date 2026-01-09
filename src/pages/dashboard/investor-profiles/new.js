import { Helmet } from 'react-helmet-async';
import InvestorBankDetails from 'src/sections/investor-profiles/investor-bank-details';


// sections


// ----------------------------------------------------------------------

export default function InvestorProfileNewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Investor Profiles List</title>
      </Helmet>

      <InvestorBankDetails />
    </>
  );
}
