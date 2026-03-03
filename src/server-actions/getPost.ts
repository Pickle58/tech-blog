"use server";

import prisma from "@/lib/prisma";

export async function getPostBySlug(slug: string) {
  if (!slug) {
    throw new Error("Slug is required!");
  }

  const post = await prisma.post.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      excerpt: true,
      coverImageURL: true,
      createdAt: true,
      author: {
        select: {
          name: true,
          image: true,
          id: true,
        },
      },
    },
  });

  if (!post) {
    return null;
  }

  return post;
}