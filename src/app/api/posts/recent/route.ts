import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                title: true,
                excerpt: true,
                slug: true,
                coverImageURL: true,
                createdAt: true,
            },
            take: 6,
        });
        return NextResponse.json({ posts }, { status: 200 });
    } catch (error) {
        console.error("FETCH_RECENT_POSTS_ERROR:", error);

        return NextResponse.json(
            { error: "Failed to fetch recent posts" },
            { status: 500 }
        );
    }
}