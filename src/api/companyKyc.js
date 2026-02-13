import useSWR from 'swr';
import { useEffect, useMemo } from 'react';
import { fetcher, endpoints } from 'src/utils/axios';


export function useGetDocuments(companyId) {
    const URL =
        companyId ? endpoints.CompanyKyc.getDocuments(String(companyId))
            : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
        keepPreviousData: true,
    });

    const refreshDocuments = () => {
        mutate(); // <-- trigger re-fetch
    };

    return {
        documents: data?.documents || [],   // <-- ALWAYS ARRAY
        loading: isLoading,
        error,
        validating: isValidating,
        empty: !isLoading && (!data?.documents || data.documents.length === 0),
        refreshDocuments,
    };
}

export function useGetBankDetails(companyId) {
    const URL =
        companyId ? endpoints.CompanyKyc.getBankDetails(String(companyId))
            : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
        keepPreviousData: true,
    });

    const refreshBankDetails = () => {
        mutate(); // <-- trigger re-fetch
    };

    return {
        bankDetails: data?.bankDetails || [],   // <-- ALWAYS ARRAY
        loading: isLoading,
        error,
        validating: isValidating,
        empty: !isLoading && (!data?.bankDetails || data.bankDetails.length === 0),
        refreshBankDetails,
    };
}

// export function useGetSignatories(companyId) {
//     const URL =
//         companyId ? endpoints.CompanyKyc.getCompanySignatories(String(companyId))
//             : null;

//     const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
//         keepPreviousData: true,
//     });

//     const refreshSignatories = () => {
//         mutate(); // <-- trigger re-fetch
//     };

//     return {
//         signatories: data?.signatories || [],   // <-- ALWAYS ARRAY
//         loading: isLoading,
//         error,
//         validating: isValidating,
//         empty: !isLoading && (!data?.signatories || data.signatories.length === 0),
//         refreshSignatories,
//     };
// }


export function useGetSignatories(companyId, queryString) {
  const URL =
    companyId ?
      queryString ? endpoints.CompanyKyc.getCompanySignatoriesWithFilter(String(companyId), queryString)
        : endpoints.CompanyKyc.getCompanySignatories(String(companyId))
      : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshSignatories = () => {
    mutate(); // <-- trigger re-fetch
  };

  return {
    signatories: data?.signatories || [],   // <-- ALWAYS ARRAY
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && (!data?.signatories || data.signatories.length === 0),
    refreshSignatories,
  };
}

export function useGetBusinessProfiles(companyId) {
    const URL =
        companyId ? endpoints.CompanyKyc.getBusinessProfile(String(companyId))
            : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
        keepPreviousData: true,
    });

    const refreshProfiles = () => {
        mutate(); // <-- trigger re-fetch
    };

    return {
        businessProfile: data?.data || [],   // <-- ALWAYS ARRAY
        loading: isLoading,
        error,
        validating: isValidating,
        empty: !isLoading && (!data?.data || data?.data?.length === 0),
        refreshProfiles,
    };
}

export function useGetCollateralAssets(companyId) {
    const URL =
        companyId ? endpoints.CompanyKyc.getCollateralassets(String(companyId))
            : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
        keepPreviousData: true,
    });
    

    const refreshCollateralAssets = () => {
        mutate(); // <-- trigger re-fetch
    };

    return {
        collateralAssets: data?.data || [],   // <-- ALWAYS ARRAY
        loading: isLoading,
        error,
        validating: isValidating,
        empty: !isLoading && (!data?.data || data?.data?.length === 0),
        refreshCollateralAssets,
    };


}


export function useGetGuarantorDetails(companyId) {
    const URL =
        companyId ? endpoints.CompanyKyc.getGuarantorDetails(String(companyId))
            : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
        keepPreviousData: true,
    });
    

    const refreshGuarantorDetails = () => {
        mutate(); // <-- trigger re-fetch
    };

    return {
        guarantorDetails: data?.data || [],   // <-- ALWAYS ARRAY
        loading: isLoading,
        error,
        validating: isValidating,
        empty: !isLoading && (!data?.data || data?.data?.length === 0),
        refreshGuarantorDetails,
    };


}

export function useGetAgreementDetails(companyId) {
    const URL =
        companyId ? endpoints.CompanyKyc.getAgrrement(String(companyId))
            : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
        keepPreviousData: true,
    });
    

    const refreshAgreementDetails = () => {
        mutate(); // <-- trigger re-fetch
    };

    return {
        agreementDetails: data?.data || [],   // <-- ALWAYS ARRAY
        loading: isLoading,
        error,
        validating: isValidating,
        empty: !isLoading && (!data?.data || data?.data?.length === 0),
        refreshAgreementDetails,
    };


}

export function useGetDpnDetails(companyId) {
    const URL =
        companyId ? endpoints.CompanyKyc.getDpn(String(companyId))
            : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
        keepPreviousData: true,
    });
    

    const refreshDpnDetails = () => {
        mutate(); 
    };

    return {
        dpnDetails: data?.data || [], 
        loading: isLoading,
        error,
        validating: isValidating,
        empty: !isLoading && (!data?.data || data?.data?.length === 0),
        refreshDpnDetails,
    };


}

export function useGetRocDetails(companyId) {
    const URL =
        companyId ? endpoints.CompanyKyc.getRoc(String(companyId))
            : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
        keepPreviousData: true,
    });
    

    const refreshRocDetails = () => {
        mutate(); 
    };

    return {
        rocDetails: data?.data || [], 
        loading: isLoading,
        error,
        validating: isValidating,
        empty: !isLoading && (!data?.data || data?.data?.length === 0),
        refreshRocDetails,
    };


}

export function useGetAuditedFinancialsDetails(companyId) {
    const URL =
        companyId ? endpoints.CompanyKyc.getAuditedFinancials(String(companyId))
            : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
        keepPreviousData: true,
    });
    

    const refreshAuditedFinancialsDetails = () => {
        mutate(); // <-- trigger re-fetch
    };

    return {
        auditedFinancials: data?.data || [],   // <-- ALWAYS ARRAY
        loading: isLoading,
        error,
        validating: isValidating,
        empty: !isLoading && (!data?.data || data?.data?.length === 0),
        refreshAuditedFinancialsDetails,
    };


}