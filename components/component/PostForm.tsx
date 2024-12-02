"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "./Icons";
import { useState } from "react";
import { addPostAction } from "@/lib/actions";

export default function PostForm() {
  const [error, setError] = useState<string | undefined>("");

  const handlePostAction = async (postData: FormData) => {
    const result = await addPostAction(postData);
    if (!result?.success) {
      setError(result?.error);
    }
  };
  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-10 h-10">
        <AvatarImage src="/placeholder-user.jpg" />
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>
      <form action={handlePostAction} className="flex flex-1 items-center">
        <Input
          type="text"
          placeholder="What's on your mind?"
          className="flex-1 rounded-full bg-muted px-4 py-2"
          name="post"
        />
        <Button variant="ghost" size="icon">
          <SendIcon className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Tweet</span>
        </Button>
      </form>
      {error && <p className="mt-1">{error}</p>}
    </div>
  );
}
