import { Button } from "../ui/button";
import { HeartIcon, MessageCircleIcon, Share2Icon } from "./Icons";

export const PostInteraction = () => (
  <div className="flex items-center gap-2">
    <Button variant="ghost" size="icon">
      <HeartIcon className="h-5 w-5 text-muted-foreground" />
    </Button>
    <Button variant="ghost" size="icon">
      <MessageCircleIcon className="h-5 w-5 text-muted-foreground" />
    </Button>
    <Button variant="ghost" size="icon">
      <Share2Icon className="h-5 w-5 text-muted-foreground" />
    </Button>
  </div>
);

export default PostInteraction;
