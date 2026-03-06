import { FetchPostsParams, FetchPostsResponse } from "@/types/post";
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

export async function searchPosts(query: string) {
    if(!query) return [];

    const res = await axios.get("/api/posts/search", {
        params: {
           q: query,
           limit: 5, 
        }
    });

    return res.data.posts;
}