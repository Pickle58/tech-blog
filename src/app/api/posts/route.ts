import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CloudinaryUploadResult, uploadToCloudinary } from "@/services/cloudinary";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import slugify from "slugify";


export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession(
            { headers: await headers() },
        )

        if (!session?.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const excerpt = formData.get("excerpt") as string;
        const coverImage = formData.get("coverImage") as File;

        if (!title || !content || !excerpt || !coverImage) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // generate the slug from the title
        const baseSlug = slugify(title, {
            lower: true,
            strict: true,
            trim: true,
        });

        // ensure slug is unique
        let slug = baseSlug;
        let counter = 1;

        while (await prisma.post.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        // upload the cover image to cloudinary

        const imageData: CloudinaryUploadResult = await uploadToCloudinary(coverImage);

        const post = await prisma.post.create({
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

        const limit = Number(searchParams.get("limit")) || DEFAULT_LIMIT;

        const posts = await prisma.post.findMany({
            take: limit + 1, // fetch one extra to check if there's a next page

            orderBy: {
                createdAt: "desc",
            },
            cursor: cursor ? { id: cursor } : undefined,

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
            const nextCursor = hasMore ? items[items.length - 1].id : null; // set the next cursor if there's a next page
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