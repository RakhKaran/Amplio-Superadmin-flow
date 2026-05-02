import { Container } from '@mui/system';
import { useLocation, useParams } from 'react-router-dom';
import CompanySignatoriesDetails from '../company-signatory-details';


export default function CompanySignatoiresDetailsView() {
  const { id } = useParams();
  const { state } = useLocation();

  console.log("📌 Received Signatory Data:", state);



  return (
    <Container>
      <CompanySignatoriesDetails currentUser={state?.signatoryData}
        listHref={state?.listHref}
        isViewMode={true}
        isEditMode={false} />
    </Container>
  );
}
