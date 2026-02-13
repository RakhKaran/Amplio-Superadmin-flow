import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetCompanyProfiles() {
    const URL = endpoints.companyProfiles.list;

    const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

    const refreshProfilesDetails = () => {
        mutate();
    };

    const memoizedValue = useMemo(
        () => ({
            companyProfiles: data?.data?.profiles || [],
            totalCount: data?.data?.count || [],
            companyProfilesLoading: isLoading,
            companyProfilesError: error,
            companyProfilesValidating: isValidating,
            companyProfilesEmpty: !isLoading && (!data?.data?.profiles?.length),
            refreshProfilesDetails
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCompanyProfile(id) {
    const URL = id ? [endpoints.companyProfiles.details(id)] : null;

    const { data, isLoading, error, isValidating , mutate} = useSWR(URL, fetcher);
        const refreshProfilesDetails = () => {
        mutate();
    };

    const memoizedValue = useMemo(
        () => ({
            companyProfile: data || [],
            companyProfileLoading: isLoading,
            companyProfileError: error,
            companyProfileValidating: isValidating,
            refreshProfilesDetails
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useFilterCompanyProfiles(params) {
    let URL = null;

    if (params.filter && params.status !== undefined) {
        URL = endpoints.companyProfiles.filterStatusList(params.filter, params.status);
    }
    else if (params.filter) {
        URL = endpoints.companyProfiles.filterList(params.filter);
    }
    else if (params.status !== undefined) {
        URL = endpoints.companyProfiles.statusList(params.status);
    }

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
        keepPreviousData: true,
    });

    return useMemo(
        () => ({
            filteredCompanyProfiles: data?.data || [],
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
