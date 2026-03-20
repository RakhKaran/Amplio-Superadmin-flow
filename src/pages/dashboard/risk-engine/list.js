import { Helmet } from 'react-helmet-async';
// sections
import RiskEngineView from 'src/sections/risk-engine/view/risk-engine-view';

// ----------------------------------------------------------------------

export default function RiskEngineListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Risk Engine</title>
      </Helmet>

      <RiskEngineView />
    </>
  );
}
