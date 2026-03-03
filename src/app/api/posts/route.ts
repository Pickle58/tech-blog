import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { CloudinaryUploadResult, uploadToCloudinary } from "@/services/cloudinary";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import slugify from "slugify";

const MAX_COVER_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;


export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession(
            { headers: await headers() },
        )

        if (!session?.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();

        const titleValue = formData.get("title");
        if (typeof titleValue !== "string") {
            return NextResponse.json({ error: "Title must be a string" }, { status: 400 });
        }
        const title = titleValue.trim();
        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const contentValue = formData.get("content");
        if (typeof contentValue !== "string") {
            return NextResponse.json({ error: "Content must be a string" }, { status: 400 });
        }
        const content = contentValue.trim();
        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const excerptValue = formData.get("excerpt");
        if (typeof excerptValue !== "string") {
            return NextResponse.json({ error: "Excerpt must be a string" }, { status: 400 });
        }
        const excerpt = excerptValue.trim();
        if (!excerpt) {
            return NextResponse.json({ error: "Excerpt is required" }, { status: 400 });
        }

        const coverImageValue = formData.get("coverImage");
        if (!(coverImageValue instanceof File)) {
            return NextResponse.json({ error: "Cover image must be a file" }, { status: 400 });
        }
        if (!coverImageValue.type || !coverImageValue.type.startsWith("image/")) {
            return NextResponse.json({ error: "Cover image must be an image MIME type" }, { status: 400 });
        }
        if (coverImageValue.size > MAX_COVER_IMAGE_SIZE_BYTES) {
            return NextResponse.json({ error: "Cover image exceeds 5MB limit" }, { status: 400 });
        }

        const coverImage = coverImageValue;

        // generate the slug from the title
        const baseSlug = slugify(title, {
            lower: true,
            strict: true,
            trim: true,
        });

        let slug = baseSlug;
        let counter = 0;

        const imageData: CloudinaryUploadResult = await uploadToCloudinary(coverImage);

        let post;

        while (true) {
            slug = counter === 0 ? baseSlug : `${baseSlug}-${counter}`;

            try {
                post = await prisma.post.create({
                    data: {
                        title,
                        content,
                        excerpt,
                        slug,
                        coverImageURL: imageData.secure_url,
                        coverImagePublicId: imageData.public_id,
                        authorId: session.user.id,
                    }
                });

                break;
            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2002"
                ) {
                    counter++;
                    continue;
                }

                throw error;
            }
        }

        return NextResponse.json({ post }, { status: 201 });
    } catch (error) {
        console.error("CREATE_POST_ERROR:", error);
        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const DEFAULT_LIMIT = 3;

        const cursor = searchParams.get("cursor");
        const [cursorCreatedAtRaw, cursorId] = cursor ? cursor.split("|") : [];
        const cursorCreatedAt = cursorCreatedAtRaw ? new Date(cursorCreatedAtRaw) : null;

        if (cursor && (!cursorId || !cursorCreatedAt || Number.isNaN(cursorCreatedAt.getTime()))) {
            return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
        }

        const limit = Number(searchParams.get("limit")) || DEFAULT_LIMIT;

        const posts = await prisma.post.findMany({
            take: limit + 1, // fetch one extra to check if there's a next page

            orderBy: [
                { createdAt: "desc" },
                { id: "desc" },
            ],
            cursor: cursor
                ? {
                    createdAt: cursorCreatedAt!,
                    id: cursorId!,
                }
                : undefined,

            skip: cursor ? 1 : 0, // skip the cursor if it's provided

            select: {
                id: true,
                title: true,
                excerpt: true,
                slug: true,
                coverImageURL: true,
                createdAt: true,
            }

        })

         // determine the pagination states
            const hasMore = posts.length > limit;

            const items =hasMore ? posts.slice(0, limit) : posts; // remove the extra item if it exists
            const nextCursor = hasMore
                ? `${items[items.length - 1].createdAt.toISOString()}|${items[items.length - 1].id}`
                : null; // set the next cursor if there's a next page
        return NextResponse.json({
            posts: items,
           nextCursor,
        });
    } catch (error) {
        console.error("GET_POSTS_ERROR:", error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}