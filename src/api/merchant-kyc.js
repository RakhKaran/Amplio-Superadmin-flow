import useSWR from 'swr';
import { useEffect, useMemo } from 'react';
import { fetcher, endpoints } from 'src/utils/axios';

export function useGetDocuments(merchantId) {
  const URL = merchantId ? endpoints.MerchantKyc.getDocuments(String(merchantId)) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshDocuments = () => {
    mutate(); // <-- trigger re-fetch
  };

  return {
    documents: data?.documents || [], // <-- ALWAYS ARRAY
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && (!data?.documents || data.documents.length === 0),
    refreshDocuments,
  };
}

export function useGetBusinessAddressDetails(merchantId) {
  const URL = merchantId
    ? endpoints.MerchantKyc.getBusinessAddressDetails(String(merchantId))
    : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshAddressDetails = () => {
    mutate();
  };

  return {
    registeredAddress: data?.registeredAddress || null,
    correspondenceAddress: data?.correspondenceAddress || null,
    loading: isLoading,
    error,
    validating: isValidating,
    refreshAddressDetails,
  };
}

export function useGetBankDetails(merchantId) {
  const URL = merchantId ? endpoints.MerchantKyc.getBankDetails(String(merchantId)) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshBankDetails = () => {
    mutate(); // <-- trigger re-fetch
  };

  return {
    bankDetails: data?.bankDetails || [], // <-- ALWAYS ARRAY
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && (!data?.bankDetails || data.bankDetails.length === 0),
    refreshBankDetails,
  };
}

export function useGetUboDetails(merchantId) {
  const URL = merchantId ? endpoints.MerchantKyc.getUboDetails(String(merchantId)) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshUboDetails = () => {
    mutate(); // <-- trigger re-fetch
  };

  return {
    uboDetails: data?.uboDetails || [],
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && (!data?.data || data?.data?.length === 0),
    refreshUboDetails,
  };
}

export function useGetPspDetails(merchantId) {
  const URL = merchantId ? endpoints.MerchantKyc.getPspDetails(String(merchantId)) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshPspDetails = () => {
    mutate(); // <-- trigger re-fetch
  };

  return {
    pspDetails: data?.psp || [], // <-- ALWAYS ARRAY
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && (!data?.data || data?.data?.length === 0),
    refreshPspDetails,
  };
}

// export function useGetSignatories(merchantId) {
//     const URL =
//         merchantId ? endpoints.MerchantKyc.getMerchantSignatories(String(merchantId))
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

export function useGetSignatories(merchantId, queryString) {
  const URL = merchantId
    ? queryString
      ? endpoints.MerchantKyc.getMerchantSignatoriesWithFilter(String(merchantId), queryString)
      : endpoints.MerchantKyc.getMerchantSignatories(String(merchantId))
    : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshSignatories = () => {
    mutate(); // <-- trigger re-fetch
  };

  return {
    signatories: data?.signatories || [], // <-- ALWAYS ARRAY
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && (!data?.signatories || data.signatories.length === 0),
    refreshSignatories,
  };
}

export function useGetBusinessProfiles(merchantId) {
  const URL = merchantId ? endpoints.MerchantKyc.getBusinessProfile(String(merchantId)) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshProfiles = () => {
    mutate(); // <-- trigger re-fetch
  };

  return {
    businessProfile: data?.data || [], // <-- ALWAYS ARRAY
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && (!data?.data || data?.data?.length === 0),
    refreshProfiles,
  };
}

export function useGetCollateralAssets(merchantId) {
  const URL = merchantId ? endpoints.MerchantKyc.getCollateralassets(String(merchantId)) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshCollateralAssets = () => {
    mutate(); // <-- trigger re-fetch
  };

  return {
    collateralAssets: data?.data || [], // <-- ALWAYS ARRAY
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && (!data?.data || data?.data?.length === 0),
    refreshCollateralAssets,
  };
}

export function useGetGuarantorDetails(merchantId) {
  const URL = merchantId ? endpoints.MerchantKyc.getGuarantorDetails(String(merchantId)) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshGuarantorDetails = () => {
    mutate(); // <-- trigger re-fetch
  };

  return {
    guarantorDetails: data?.data || [], // <-- ALWAYS ARRAY
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && (!data?.data || data?.data?.length === 0),
    refreshGuarantorDetails,
  };
}

export function useGetAgreementDetails(merchantId) {
  const URL = merchantId ? endpoints.MerchantKyc.getAgrrement(String(merchantId)) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshAgreementDetails = () => {
    mutate(); // <-- trigger re-fetch
  };

  return {
    agreementDetails: data?.data || [], // <-- ALWAYS ARRAY
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && (!data?.data || data?.data?.length === 0),
    refreshAgreementDetails,
  };
}

export function useGetDpnDetails(merchantId) {
  const URL = merchantId ? endpoints.MerchantKyc.getDpn(String(merchantId)) : null;

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

export function useGetRocDetails(merchantId) {
  const URL = merchantId ? endpoints.MerchantKyc.getRoc(String(merchantId)) : null;

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

export function useGetAuditedFinancialsDetails(merchantId) {
  const URL = merchantId ? endpoints.MerchantKyc.getAuditedFinancials(String(merchantId)) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshAuditedFinancialsDetails = () => {
    mutate(); // <-- trigger re-fetch
  };

  return {
    auditedFinancials: data?.data || [], // <-- ALWAYS ARRAY
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && (!data?.data || data?.data?.length === 0),
    refreshAuditedFinancialsDetails,
  };
}

export function useGetFinancialsDetails(merchantId) {
  const URL = merchantId ? endpoints.MerchantKyc.getFinancials(String(merchantId)) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshFinancialsDetails = () => {
    mutate(); // <-- trigger re-fetch
  };

  return {
    financialDetails: data?.data || [], // <-- ALWAYS ARRAY
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && (!data?.data || data?.data?.length === 0),
    refreshFinancialsDetails,
  };
}
