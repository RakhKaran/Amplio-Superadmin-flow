import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetMerchantSummary(merchantId) {
  const URL = merchantId ? endpoints.MerchantKyc.getSummary(String(merchantId)) : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshSummary = () => {
    mutate();
  };

  const memoizedValue = useMemo(
    () => ({
      summary: data || null,
      summaryLoading: isLoading,
      summaryError: error,
      summaryValidating: isValidating,
      refreshSummary,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
