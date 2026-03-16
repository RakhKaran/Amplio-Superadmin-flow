import { Helmet } from 'react-helmet-async';
// sections
import MerchantBankDetails from 'src/sections/merchant-profiles/bank/merchant-bank-details';

// ----------------------------------------------------------------------

export default function MerchantProfliesNewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Merchant Profiles List</title>
      </Helmet>

      <MerchantBankDetails />
    </>
  );
}
