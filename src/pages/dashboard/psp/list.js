import { Helmet } from 'react-helmet-async';
// sections
import PSPListView from 'src/sections/psp/view/psp-list-view';

// ----------------------------------------------------------------------

export default function PSPListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: PSP List</title>
      </Helmet>

      <PSPListView />
    </>
  );
}
