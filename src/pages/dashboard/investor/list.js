import { Helmet } from "react-helmet-async";
import { InvestorListView } from "src/sections/investor/view";

export default function InvestorListPage() {
    return (
        <>
            <Helmet>
                <title>Dashboard: Investor</title>
            </Helmet>
            <InvestorListView/>
        </>
    )
}