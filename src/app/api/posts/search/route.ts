import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const DEFAULT_LIMIT = 5;
    const MIN_LIMIT = 1;
    const MAX_LIMIT = 20;
    const MIN_QUERY_LENGTH = 2;

    const query = searchParams.get("q")?.trim();

    const limitParam = searchParams.get("limit");

    let limit = DEFAULT_LIMIT;

    if (limitParam !== null) {
      if (limitParam.trim() === "") {
        return NextResponse.json(
          { error: "limit must be a whole number" },
          { status: 400 }
        );
      }

      const parsedLimit = Number(limitParam);

      if (!Number.isFinite(parsedLimit) || !Number.isInteger(parsedLimit)) {
        return NextResponse.json(
          { error: "limit must be a whole number" },
          { status: 400 }
        );
      }

      limit = Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, parsedLimit));
    }

    if (!query || query.length < MIN_QUERY_LENGTH) {
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