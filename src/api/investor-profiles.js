import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetInvestorProfiles() {
    const URL = endpoints.investorProfiles.list;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            investorProfiles: data?.data?.profiles || [],
            totalCount: data?.data?.count || [],
            investorProfilesLoading: isLoading,
            investorProfilesError: error,
            investorProfilesValidating: isValidating,
            investorProfilesEmpty: !isLoading && (!data?.data?.profiles?.length),
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetInvestorProfile(id) {
    const URL = id ? [endpoints.investorProfiles.details(id)] : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            investorProfile: data || [],
            investorProfileLoading: isLoading,
            investorProfileError: error,
            investorProfileValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useFilterInvestorProfiles(params) {
    let URL = null;

    if (params.filter && params.status !== undefined) {
        URL = endpoints.investorProfiles.filterStatusList(params.filter, params.status);
    }
    else if (params.filter) {
        URL = endpoints.investorProfiles.filterList(params.filter);
    }
    else if (params.status !== undefined) {
        URL = endpoints.investorProfiles.statusList(params.status);
    }

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
        keepPreviousData: true,
    });
   
    return useMemo(
        () => ({
            filteredInvestorProfiles: data?.data || [],
            count: data?.count || {
                totalCount: 0,
                totalRejected: 0,
                totalPending: 0,
                totalUnderReview: 0,
                totalVerified: 0,
            },
            filterLoading: isLoading,
            filterError: error,
            filterValidating: isValidating,
            filterEmpty: !isLoading && (!data?.data?.length),
        }),
        [data, error, isLoading, isValidating]
    );
}
