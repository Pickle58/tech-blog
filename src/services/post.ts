import { FetchPostsParams, FetchPostsResponse, SearchPostResult } from "@/types/post";
import axios from "axios";

export async function fetchPosts({
    pageParam,
    limit,
}: FetchPostsParams): Promise<FetchPostsResponse> {
    const res = await axios.get("/api/posts", {
        params: {
            cursor: pageParam,
            limit,
        }
    });

    return res.data;
}

export async function searchPosts(query: string): Promise<SearchPostResult[]> {
    if(!query) return [];

    const res = await axios.get<{ posts: SearchPostResult[] }>("/api/posts/search", {
        params: {
           q: query,
           limit: 5, 
        }
    });

    return res.data.posts;
}