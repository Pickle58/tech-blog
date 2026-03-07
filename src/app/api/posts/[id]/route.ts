import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  CloudinaryUploadResult,
  deleteFromCloudinary,
  uploadToCloudinary,
} from "@/services/cloudinary";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const MAX_COVER_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        coverImageURL: true,
        authorId: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error("GET_POST_BY_ID_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let newUploadedImagePublicId: string | null = null;
  let oldImagePublicIdToDelete: string | null = null;

  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingOwnedPost = await prisma.post.findFirst({
      where: { id, authorId: session.user.id },
      select: {
        id: true,
        coverImagePublicId: true,
        updatedAt: true,
      },
    });

    if (!existingOwnedPost) {
      const postExists = await prisma.post.findUnique({
        where: { id },
        select: { id: true },
      });

      return NextResponse.json(
        { error: postExists ? "Forbidden" : "Post not found" },
        { status: postExists ? 403 : 404 }
      );
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

    let nextCoverImageURL: string | undefined;
    let nextCoverImagePublicId: string | undefined;

    if (coverImageValue instanceof File && coverImageValue.size > 0) {
      if (!coverImageValue.type || !coverImageValue.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Cover image must be an image MIME type" },
          { status: 400 }
        );
      }

      if (coverImageValue.size > MAX_COVER_IMAGE_SIZE_BYTES) {
        return NextResponse.json(
          { error: "Cover image exceeds 5MB limit" },
          { status: 400 }
        );
      }

      const imageData: CloudinaryUploadResult = await uploadToCloudinary(coverImageValue);
      newUploadedImagePublicId = imageData.public_id;
      oldImagePublicIdToDelete = existingOwnedPost.coverImagePublicId;
      nextCoverImageURL = imageData.secure_url;
      nextCoverImagePublicId = imageData.public_id;
    }

    const updated = await prisma.post.updateMany({
      where: {
        id,
        authorId: session.user.id,
        updatedAt: existingOwnedPost.updatedAt,
      },
      data: {
        title,
        excerpt,
        content,
        ...(nextCoverImageURL && {
          coverImageURL: nextCoverImageURL,
          coverImagePublicId: nextCoverImagePublicId,
        }),
      },
    });

    if (updated.count === 0) {
      if (newUploadedImagePublicId) {
        await deleteFromCloudinary(newUploadedImagePublicId);
      }
      return NextResponse.json(
        { error: "Post was modified or deleted concurrently" },
        { status: 409 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
      },
    });

    if (!post) {
      if (newUploadedImagePublicId) {
        await deleteFromCloudinary(newUploadedImagePublicId);
      }

      if (oldImagePublicIdToDelete) {
        await deleteFromCloudinary(oldImagePublicIdToDelete);
      }

      return NextResponse.json(
        { error: "Post was modified or deleted concurrently" },
        { status: 409 }
      );
    }

    if (oldImagePublicIdToDelete) {
      await deleteFromCloudinary(oldImagePublicIdToDelete);
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    if (newUploadedImagePublicId) {
      await deleteFromCloudinary(newUploadedImagePublicId);
    }

    console.error("UPDATE_POST_ERROR:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingOwnedPost = await prisma.post.findFirst({
      where: { id, authorId: session.user.id },
      select: {
        id: true,
        coverImagePublicId: true,
      },
    });

    if (!existingOwnedPost) {
      const postExists = await prisma.post.findUnique({
        where: { id },
        select: { id: true },
      });

      return NextResponse.json(
        { error: postExists ? "Forbidden" : "Post not found" },
        { status: postExists ? 403 : 404 }
      );
    }

    const deleted = await prisma.post.deleteMany({
      where: { id, authorId: session.user.id },
    });

    if (deleted.count === 0) {
      const postExists = await prisma.post.findUnique({
        where: { id },
        select: { id: true },
      });

      return NextResponse.json(
        { error: postExists ? "Forbidden" : "Post not found" },
        { status: postExists ? 403 : 404 }
      );
    }

    if (existingOwnedPost.coverImagePublicId) {
      await deleteFromCloudinary(existingOwnedPost.coverImagePublicId);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE_POST_ERROR:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
