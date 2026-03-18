import { Helmet } from 'react-helmet-async';
// sections
import PSPDetailsView from 'src/sections/psp/view/psp-details-view';

// ----------------------------------------------------------------------

export default function PSPDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: PSP Details</title>
      </Helmet>

      <PSPDetailsView />
    </>
  );
}
