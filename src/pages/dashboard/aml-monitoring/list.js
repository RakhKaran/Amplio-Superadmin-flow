import { Helmet } from 'react-helmet-async';
import AmlMonitoringView from 'src/sections/aml-monitoring/view/aml-monitoring-view';
// sections

// ----------------------------------------------------------------------

export default function AmlMonitoringPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Fraud Intelligence</title>
      </Helmet>

      <AmlMonitoringView/>
    </>
  );
}
