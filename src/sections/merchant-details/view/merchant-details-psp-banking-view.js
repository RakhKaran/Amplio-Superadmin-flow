// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { _merchantDetailsList } from 'src/_mock/_merchantDetails';
import MerchantDetailsPSPBanking from '../merchant-details-psp-banking';

// ----------------------------------------------------------------------

export default function MerchantDetailsPSPBankingView() {
  const settings = useSettingsContext();
  const { id } = useParams();

  const merchantDetail = _merchantDetailsList.find((item) => item.id === id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Merchant PSP & Banking"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Merchant Details', href: paths.dashboard.merchantDetails.root },
          { name: merchantDetail?.merchantName, href: paths.dashboard.merchantDetails.details(id) },
          { name: 'PSP & Banking' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <MerchantDetailsPSPBanking merchant={merchantDetail} />
    </Container>
  );
}
