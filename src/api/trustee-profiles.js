import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetTrusteeProfiles() {
    const URL = endpoints.trusteeProfiles.list;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            trusteeProfiles: data?.data?.profiles || [],
            totalCount: data?.data?.count || [],
            trusteeProfilesLoading: isLoading,
            trusteeProfilesError: error,
            trusteeProfilesValidating: isValidating,
            trusteeProfilesEmpty: !isLoading && (!data?.data?.profiles?.length),
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetTrusteeProfile(id) {
    const URL = id ? [endpoints.trusteeProfiles.details(id)] : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            trusteeProfile: data || [],
            trusteeProfileLoading: isLoading,
            trusteeProfileError: error,
            trusteeProfileValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useFilterTrusteeProfiles(params) {
    let URL = null;

    if (params.filter && params.status !== undefined) {
        URL = endpoints.trusteeProfiles.filterStatusList(params.filter, params.status);
    }
    else if (params.filter) {
        URL = endpoints.trusteeProfiles.filterList(params.filter);
    }
    else if (params.status !== undefined) {
        URL = endpoints.trusteeProfiles.statusList(params.status);
    }

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
        keepPreviousData: true,
    });

    return useMemo(
        () => ({
            filteredTrusteeProfiles: data?.data || [],
            totalCount: data?.count || {
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
