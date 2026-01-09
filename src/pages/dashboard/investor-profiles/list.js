import { Helmet } from 'react-helmet-async';
import { InvestorProfileListView } from 'src/sections/investor-profiles/view';

// sections


// ----------------------------------------------------------------------

export default function InvestorProfileListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Investor Profiles List</title>
      </Helmet>

      <InvestorProfileListView />
    </>
  );
}
