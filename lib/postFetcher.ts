import prisma from "./prisma";

export const fetchPosts = (autherId: string) => {
  return prisma.post.findMany({
    where: {
      authorId: {
        in: [autherId],
      },
    },
    include: {
      author: true,
      likes: {
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          replies: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export default fetchPosts;
