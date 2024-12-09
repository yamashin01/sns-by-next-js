"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import prisma from "./prisma";

export const addPostAction = async (formData: FormData) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return {
        error: "",
        success: true,
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
      return {
        error: "",
        success: true,
      };
    }

    await prisma.post.create({
      data: {
        content: validatedPostText,
        authorId: user.id,
      },
    });
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
