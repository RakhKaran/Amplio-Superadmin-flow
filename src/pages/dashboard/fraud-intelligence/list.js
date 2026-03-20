import { Helmet } from 'react-helmet-async';
import FraudIntelligenceView from 'src/sections/fraud-intelligence/view/fraud-intelligence-view';
// sections

// ----------------------------------------------------------------------

export default function FraudIntelligencePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Fraud Intelligence</title>
      </Helmet>

      <FraudIntelligenceView/>
    </>
  );
}
