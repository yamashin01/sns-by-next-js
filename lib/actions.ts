"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "./prisma";

type State = {
  error?: string | undefined;
  success: boolean;
};

export const addPostAction = async (
  prevState: State,
  formData: FormData
): Promise<State> => {
  try {
    const { userId } = auth();
    if (!userId) {
      return {
        error: "ユーザーが見つかりません。",
        success: false,
      };
    }

    const postText = formData.get("post") as string;
    const postTextSchema = z
      .string()
      .min(1, { message: "文字を入力してください。" })
      .max(140, { message: "140文字以内にしてください。" });
    const validatedPostText = postTextSchema.parse(postText);

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!user) {
      console.error("User not found in database");
      throw new Error("User not found in database");
    }

    await prisma.post.create({
      data: {
        content: validatedPostText,
        authorId: user.id,
      },
    });

    // Update caches
    revalidatePath("/");

    return {
      error: undefined,
      success: true,
    };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        error: err.errors.map((e) => e.message).join(", "),
        success: false,
      };
    } else if (err instanceof Error) {
      return {
        error: err.message,
        success: false,
      };
    } else {
      return {
        error: "予期せぬエラーが発生しました。",
        success: false,
      };
    }
  }
};
