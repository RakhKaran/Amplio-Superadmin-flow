import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import { element } from 'prop-types';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/analytics'));
// const IndexPage = lazy(() => import('src/pages/dashboard/app'));
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
// PRODUCT
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// ORDER
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// INVOICE
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// USER
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// COMPANY PROFILES FOR KYC
const CompanyProfileListPage = lazy(() => import('src/pages/dashboard/company-profiles/list'));
const CompanyProfliesDetailsPage = lazy(() =>
  import('src/pages/dashboard/company-profiles/details')
);
const CompanyProfileNewPage = lazy(() => import('src/pages/dashboard/company-profiles/new'));
// INVESTOR PROFILES FOR KYC
const InvestorProfileListPage = lazy(() => import('src/pages/dashboard/investor-profiles/list'));
const InvestorProfileDetailsPage = lazy(() =>
  import('src/pages/dashboard/investor-profiles/details')
);
const InvestorProfileNewPage = lazy(() => import('src/pages/dashboard/investor-profiles/new'));

// INVESTOR MASTER
const InvestorListPage = lazy(() => import('src/pages/dashboard/investor/list'));
const IvestorDetailsPage = lazy(() => import('src/pages/dashboard/investor/details'))

// SPV MANAGEMENT
const SpvManagementListPage = lazy(() => import('src/pages/dashboard/spv-management/list'));
const SpvManagementDetailsPage = lazy(() => import('src/pages/dashboard/spv-management/details'))
const SpvPoolDetailsPage = lazy(() => import('src/pages/dashboard/spv-management/pool-details'))


// MERCHANT PROFILES FOR KYC
const MerchantProfliesListPage = lazy(() => import('src/pages/dashboard/merchant-profiles/list'));
const MerchantProfliesDetailsPage = lazy(() =>
  import('src/pages/dashboard/merchant-profiles/details')
);
const MerchantProfliesNewPage = lazy(() => import('src/pages/dashboard/merchant-profiles/new'));

// MERCHANT DETAILS (DUMMY)
const MerchantDetailsListPage = lazy(() => import('src/pages/dashboard/merchant-details/list'));
const MerchantDetailsPage = lazy(() => import('src/pages/dashboard/merchant-details/details'));

// PSP (DUMMY)
const PSPListPage = lazy(() => import('src/pages/dashboard/psp/list'));
const PSPDetailsPage = lazy(() => import('src/pages/dashboard/psp/details'));

// ESCROW OPERATIONS
const EscrowOperationsPage = lazy(() => import('src/pages/dashboard/escrow-operations'));

// TRUSTEE PROFILE FOR KYC
const TrusteeProfileListPage = lazy(() => import('src/pages/dashboard/trustee-profiles/list'));
const TrusteeProfliesDetailsPage = lazy(() =>
  import('src/pages/dashboard/trustee-profiles/details')
);
const TrusteeProfileNewPage = lazy(() => import('src/pages/dashboard/trustee-profiles/new'));

// COMPANY PROFILE
const CompanyProfilePage = lazy(() => import('src/pages/dashboard/company/profile'));

// COMPANY
const ROIGuidancePage = lazy(() => import('src/pages/dashboard/issure-services/roi'));
const ROIFundFormPage = lazy(() => import('src/pages/dashboard/issure-services/roi-fund-form'));
const AfterCompleteRoiStagePage = lazy(() => import('src/pages/dashboard/issure-services/view'));
// WORKFLOW
const ReactFlowPage = lazy(() => import('src/pages/dashboard/react-flow/board'));
// Document
const NewDocumentPage = lazy(() => import('src/pages/dashboard/documents/new'));
const DocumentEditPage = lazy(() => import('src/pages/dashboard/documents/edit'));
const DocumentListPage = lazy(() => import('src/pages/dashboard/documents/list'));
// DEBENTURE TRUSTEES
// const DebentureTrusteeEditPage = lazy(() => import('src/pages/dashboard/debenture-trustees/edit'))
// const NewDebentureTrusteesPage = lazy(() => import('src/pages/dashboard/debenture-trustees/new'));
// const DebentureTrusteesListPage = lazy(() => import('src/pages/dashboard/debenture-trustees/debenture-trustees-list'));
// const DebentureTrusteesDocumentDraftPage = lazy(() => import('src/pages/dashboard/debenture-trustees/debenture-trustees-document-draft'))
// SCHEDULER
const SchedulerNewPage = lazy(() => import('src/pages/dashboard/scheduler/new'));
const SchedulerListPage = lazy(() => import('src/pages/dashboard/scheduler/list'));
const SchedulerEditPage = lazy(() => import('src/pages/dashboard/scheduler/edit'));
const SchedulerViewPage = lazy(() => import('src/pages/dashboard/scheduler/view'));
// SIGNATORY
const TrusteeSignatoryDetailsPage = lazy(() =>
  import('src/pages/dashboard/signatories/trustee-signatory-details')
);
const CompanySignatoryDetailsPage = lazy(() =>
  import('src/pages/dashboard/signatories/company-signatory-details')
);
// DESIGNATION
const DesignationNewPage = lazy(() => import('src/pages/dashboard/designation/new'));
const DesignationListPage = lazy(() => import('src/pages/dashboard/designation/list'));
const DesignationEditPage = lazy(() => import('src/pages/dashboard/designation/edit'));
const DesignationViewPage = lazy(() => import('src/pages/dashboard/designation/view'));
// BLOG
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// JOB
const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// TOUR
const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// FILE MANAGER
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// APP
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// TEST RENDER PAGE BY ROLE
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// BLANK PAGE
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));
// Risk Engine
const RiskEngineListPage = lazy(() => import('src/pages/dashboard/risk-engine/list'));
// Fraud Intelligence 
const FraudIntelligencePage = lazy(()=> import('src/pages/dashboard/fraud-intelligence/list'));
// AML Monitoring
const AmlMonitoringPage = lazy(()=> import('src/pages/dashboard/aml-monitoring/list'))

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      // { path: 'ecommerce', element: <OverviewEcommercePage /> },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      // { path: 'banking', element: <OverviewBankingPage /> },
      // { path: 'booking', element: <OverviewBookingPage /> },
      // { path: 'file', element: <OverviewFilePage /> },
      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'company',
        children: [
          { element: <CompanyProfilePage />, index: true },
          { path: 'profile', element: <CompanyProfilePage /> },
        ],
      },
      {
        path: 'companyProfiles',
        children: [
          { element: <CompanyProfileListPage />, index: true },
          { path: 'list', element: <CompanyProfileListPage /> },
          { path: ':id', element: <CompanyProfliesDetailsPage /> },
          { path: 'new', element: <CompanyProfileNewPage /> },
        ],
      },
      {
        path: 'investorProfiles',
        children: [
          { element: <InvestorProfileListPage />, index: true },
          { path: 'list', element: <InvestorProfileListPage /> },
          { path: ':id', element: <InvestorProfileDetailsPage /> },
          { path: 'new', element: <InvestorProfileNewPage /> },
        ],
      },
      {
        path: 'investor',
        children: [
          { element: <InvestorListPage />, index: true },
          { path: 'list', element: <InvestorListPage /> },
          { path: ':id', element: <IvestorDetailsPage /> },
          // { path: 'new', element: <InvestorProfileNewPage /> },
        ],
      },
      {
        path: 'spv-management',
        children: [
          { element: <SpvManagementListPage />, index: true },
          { path: 'list', element: <SpvManagementListPage /> },
          { path: 'pool/:id', element: <SpvPoolDetailsPage /> },
          { path: ':id', element: <SpvManagementDetailsPage /> }
        ],
      },
      {
        path: 'merchant',
        children: [
          { element: <MerchantProfliesListPage />, index: true },
          { path: 'list', element: <MerchantProfliesListPage /> },
          { path: ':id', element: <MerchantProfliesDetailsPage /> },
          { path: 'new', element: <MerchantProfliesNewPage /> },
        ],
      },
      {
        path: 'merchant-details',
        children: [
          { element: <MerchantDetailsListPage />, index: true },
          { path: 'list', element: <MerchantDetailsListPage />, index: true },
          { path: ':id', element: <MerchantDetailsPage /> },
        ],
      },
      {
        path: 'psp',
        children: [
          { element: <PSPListPage />, index: true },
          { path: 'list', element: <PSPListPage /> },
          { path: ':id', element: <PSPDetailsPage /> },
        ],
      },
      {
        path: 'escrow-operations',
        element: <EscrowOperationsPage />,
      },
      {
        path: 'risk-engine',
        element: <RiskEngineListPage />,
      },
       {
        path: 'fraud-intelligence',
        element: <FraudIntelligencePage />,
      },
        {
        path: 'aml-monitoring',
        element: <AmlMonitoringPage />,
      },
      {
        path: 'trusteeProfiles',
        children: [
          { element: <TrusteeProfileListPage />, index: true },
          { path: 'list', element: <TrusteeProfileListPage /> },
          { path: 'new', element: <TrusteeProfileNewPage /> },
          { path: ':id', element: <TrusteeProfliesDetailsPage /> },
        ],
      },
      {
        path: 'issureservices',
        children: [
          { element: <ROIGuidancePage />, index: true },
          { path: 'roi', element: <ROIGuidancePage /> },
          { path: 'fund-position-form', element: <ROIFundFormPage /> },
          { path: 'view', element: <AfterCompleteRoiStagePage /> },
        ],
      },
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'order',
        children: [
          { element: <OrderListPage />, index: true },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },

      {
        path: 'reactflow',
        children: [
          { element: <ReactFlowPage />, index: true },
          { path: 'list', element: <ReactFlowPage /> },
          // { path: ':id', element: <InvoiceDetailsPage /> },
          // { path: ':id/edit', element: <InvoiceEditPage /> },
          // { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'document',
        children: [
          { element: <DocumentListPage />, index: true },
          { path: 'new', element: <NewDocumentPage /> },
          { path: 'list', element: <DocumentListPage /> },
          { path: ':id/edit', element: <DocumentEditPage /> },
          // { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      // {
      //   path: 'debenturetrustees',
      //   children: [
      //     { element: <DebentureTrusteesListPage />, index: true },
      //     { path: 'debenture-trustees-list', element: <DebentureTrusteesListPage /> },
      //     { path: ':id', element: <DebentureTrusteesDocumentDraftPage /> },
      //     { path: ':id/edit', element: <DebentureTrusteeEditPage /> },
      //     { path: 'new', element: <NewDebentureTrusteesPage /> },
      //   ],
      // },

      {
        path: 'scheduler',
        children: [
          { element: <SchedulerListPage />, index: true },
          { path: 'list', element: <SchedulerListPage /> },
          { path: ':id', element: <SchedulerViewPage /> },
          { path: ':id/edit', element: <SchedulerEditPage /> },
          { path: 'new', element: <SchedulerNewPage /> },
        ],
      },
      {
        path: 'designation',
        children: [
          { element: <DesignationListPage />, index: true },
          { path: 'list', element: <DesignationListPage /> },
          { path: ':id', element: <DesignationViewPage /> },
          { path: ':id/edit', element: <DesignationEditPage /> },
          { path: 'new', element: <DesignationNewPage /> },
        ],
      },
      {
        path: 'signatory',
        children: [
          { element: <CompanySignatoryDetailsPage />, index: true },

          { path: 'company/:id', element: <CompanySignatoryDetailsPage /> },

          { path: 'trustee/:id', element: <TrusteeSignatoryDetailsPage /> },
        ],
      },

      {
        path: 'invoice',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'post',
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'job',
        children: [
          { element: <JobListPage />, index: true },
          { path: 'list', element: <JobListPage /> },
          { path: ':id', element: <JobDetailsPage /> },
          { path: 'new', element: <JobCreatePage /> },
          { path: ':id/edit', element: <JobEditPage /> },
        ],
      },
      {
        path: 'tour',
        children: [
          { element: <TourListPage />, index: true },
          { path: 'list', element: <TourListPage /> },
          { path: ':id', element: <TourDetailsPage /> },
          { path: 'new', element: <TourCreatePage /> },
          { path: ':id/edit', element: <TourEditPage /> },
        ],
      },
      { path: 'file-manager', element: <FileManagerPage /> },
      { path: 'mail', element: <MailPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'permission', element: <PermissionDeniedPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];

