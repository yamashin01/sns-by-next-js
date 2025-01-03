import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { SendIcon } from "./Icons";

export const SubmitButton = () => {
  const { pending, data, method, action } = useFormStatus();
  console.log(pending, data, method, action);
  return (
    <>
      <Button variant="ghost" size="icon" disabled={pending}>
        <SendIcon className="h-5 w-5 text-muted-foreground" />
        <span className="sr-only">Tweet</span>
      </Button>
    </>
  );
};

export default SubmitButton;
