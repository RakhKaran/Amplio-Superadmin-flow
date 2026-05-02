import { Container } from '@mui/system';
import { useLocation, useParams } from 'react-router-dom';
import InvestorSignatoriesDetails from '../investor-signatory-details';


export default function InvestorSignatoiresDetailsView() {
  const { id } = useParams();
  const { state } = useLocation();

  console.log("📌 Received Signatory Data:", state);



  return (
    <Container>
      <InvestorSignatoriesDetails currentUser={state?.signatoryData}
        listHref={state?.listHref}
        isViewMode={true}
        isEditMode={false} />
    </Container>
  );
}
