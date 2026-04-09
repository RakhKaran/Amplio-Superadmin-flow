import useSWR from 'swr';
import { fetcher, endpoints } from 'src/utils/axios';


export function useGetDocuments(investorId) {
    const URL =
        investorId ? endpoints.InvestorKyc.getDocuments(String(investorId))
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

export function useGetBankDetails(investorId) {
    const URL =
        investorId ? endpoints.InvestorKyc.getBankDetails(String(investorId))
            : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
        keepPreviousData: true,
    });

    const refreshBankDetails = () => {
        mutate(); // <-- trigger re-fetch
    };

    return {
        bankDetails: data?.bankDetails,
        loading: isLoading,
        error,
        validating: isValidating,
        empty:
          !isLoading &&
          (!data?.bankDetails ||
            (Array.isArray(data.bankDetails) ? data.bankDetails.length === 0 : false)),
        refreshBankDetails,
    };
}

export function useGetUBOs(investorId) {
  const URL = investorId ? endpoints.InvestorKyc.getUboDetails(String(investorId)) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshUbos = () => {
    mutate();
  };

  return {
    ubos: data?.uboDetails || [],
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && (!data?.uboDetails || data.uboDetails.length === 0),
    refreshUbos,
  };
}

export function useGetKycAddressDetails(investorId) {
  const URL = investorId ? endpoints.InvestorKyc.getAddressDetails(String(investorId)) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  return {
    registeredAddress: data?.registeredAddress || null,
    correspondenceAddress: data?.correspondenceAddress || null,
    loading: isLoading,
    error,
    validating: isValidating,
    refreshAddressDetails: mutate,
  };
}

export function useGetCompliances(investorId) {
  const URL = investorId
    ? endpoints.InvestorKyc.getComplianceDeclarations(String(investorId))
    : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  return {
    compliance:
      data?.complianceDeclaration ||
      data?.compliance ||
      data?.data ||
      null,
    loading: isLoading,
    error,
    validating: isValidating,
    refreshCompliances: mutate,
  };
}

export function useGetInvestmentMandates(investorId) {
  const URL = investorId
    ? endpoints.InvestorKyc.getInvestmentMandate(String(investorId))
    : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  return {
    investmentMandates:
      data?.investmentMandate ||
      data?.investmentMandates ||
      data?.data ||
      null,
    loading: isLoading,
    error,
    validating: isValidating,
    refreshInvestmentMandates: mutate,
  };
}

export function useGetAgreement(investorId) {
  const URL = investorId ? endpoints.InvestorKyc.getPlatformAgreement(String(investorId)) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  return {
    agreements: data?.agreements || data?.data || data || null,
    loading: isLoading,
    error,
    validating: isValidating,
    refreshAgreement: mutate,
  };
}

// export function useGetSignatories(investorId) {
//     const URL =
//         investorId ? endpoints.InvestorKyc.getInvestorSignatories(String(investorId))
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


export function useGetSignatories(investorId, queryString) {
  const URL =
    investorId ?
      queryString ? endpoints.InvestorKyc.getInvestorSignatoriesWithFilter(String(investorId), queryString)
        : endpoints.InvestorKyc.getInvestorSignatories(String(investorId))
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
