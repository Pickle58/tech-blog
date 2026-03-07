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
    const q = query.trim();

    if(!q) return [];

    const res = await axios.get<{ posts: SearchPostResult[] }>("/api/posts/search", {
        params: {
           q,
           limit: 5, 
        }
    });

    return res.data.posts;
}