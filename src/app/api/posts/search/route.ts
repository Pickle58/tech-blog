import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("q")?.trim();

    const limit = Number(searchParams.get("limit")) || 5;

    if (!query) {
      return NextResponse.json({ posts: [] });
    }

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            excerpt: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("SEARCH_POSTS_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to search posts" },
      { status: 500 }
    );
  }
}