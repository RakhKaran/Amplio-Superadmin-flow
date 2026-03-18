import { useMemo } from 'react';
import { endpoints, fetcher } from 'src/utils/axios';
import useSWR from 'swr';

export function useGetPsp() {
  const URL = endpoints.pspMaster.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      psp: data || [],
      pspLoading: isLoading,
      pspError: error,
      pspValidating: isValidating,
      pspEmpty: !isLoading && !data?.length,
    }),
    [data, isLoading, error, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetPspDetails(pspId) {
  const URL = pspId ? endpoints.pspMaster.details(pspId) : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      psp: data,
      pspLoading: isLoading,
      pspError: error,
      pspValidating: isValidating,
    }),
    [data, isLoading, error, isValidating]
  );

  return memoizedValue;
}
