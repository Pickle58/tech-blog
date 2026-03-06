import { fetchPosts } from "@/services/post";
import { FetchPostsResponse } from "@/types/post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";



export function useInfinitePosts({ limit }: { limit: number }) {
    return useInfiniteQuery<FetchPostsResponse>({
        queryKey: ["posts"],
        queryFn: ({ pageParam }) =>
            fetchPosts({
                pageParam: pageParam as string | null,
                limit,
            }),
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })
}

export function useDebounce<T>(value: T, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);

        return () => clearTimeout(timer);
    },[value, delay]);

    return debouncedValue;
}