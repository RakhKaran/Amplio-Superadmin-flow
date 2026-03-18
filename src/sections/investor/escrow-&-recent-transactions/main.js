import { Grid } from "@mui/material";
import InvestorEscrowDetails from "./investor-escrow-details";
import InvestorEscrowTransactions from "./investor-escrow-transactions";

export default function EscrowMainPage({ escrow, transactions }) {
  return (
    <Grid container spacing={3}>
      
      <Grid item xs={12} md={6}>
        <InvestorEscrowDetails escrow={escrow} />
      </Grid>

      <Grid item xs={12} md={6}>
        <InvestorEscrowTransactions transactions={transactions} />
      </Grid>

    </Grid>
  );
}