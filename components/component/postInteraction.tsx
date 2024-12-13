import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Button } from "../ui/button";
import { HeartIcon, MessageCircleIcon, Share2Icon } from "./Icons";

type PostInteractionProps = {
  postId: string;
  initialLikes: string[];
  commentNumber: number;
};
export const PostInteraction = ({
  postId,
  initialLikes,
  commentNumber,
}: PostInteractionProps) => {
  const likeAction = async () => {
    "use server";
    try {
      const { userId } = auth();
      if (!userId) throw new Error("ユーザーが見つかりません。");
      const autherId = await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
        select: {
          id: true,
        },
      });
      if (!autherId) throw new Error("ユーザーが見つかりません。");

      const prevLike = await prisma.like.findFirst({
        where: {
          postId,
          userId: autherId.id,
        },
      });
      if (prevLike) {
        await prisma.like.delete({
          where: {
            id: prevLike.id,
          },
        });
      } else {
        await prisma.like.create({
          data: {
            postId,
            userId: autherId.id,
          },
        });
      }
      revalidatePath("/");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex items-center gap-2">
      <form action={likeAction}>
        <Button variant="ghost" size="icon">
          <HeartIcon className="h-5 w-5 text-muted-foreground" />
        </Button>
      </form>
      <span className="-ml-1">{initialLikes.length}</span>
      <Button variant="ghost" size="icon">
        <MessageCircleIcon className="h-5 w-5 text-muted-foreground" />
      </Button>
      <span className="-ml-1">{commentNumber}</span>
      <Button variant="ghost" size="icon">
        <Share2Icon className="h-5 w-5 text-muted-foreground" />
      </Button>
    </div>
  );
};

export default PostInteraction;
