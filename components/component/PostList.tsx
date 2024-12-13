import fetchPosts from "@/lib/postFetcher";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Post from "./post";

export default async function PostList() {
  const { userId } = auth();
  if (!userId) return;

  const autherId = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
    select: {
      id: true,
    },
  });
  if (!autherId) return;

  const posts = await fetchPosts(autherId.id);

  return (
    <div className="space-y-4">
      {posts.length !== 0 ? (
        posts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <div>投稿がありません。</div>
      )}
    </div>
  );
}
