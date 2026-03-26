import { format } from "date-fns";

type PostMetaProps = {
  date: string;
  readingTime: string;
};

export function PostMeta({ date, readingTime }: PostMetaProps) {
  return (
    <p className="text-sm text-muted-foreground">
      {format(new Date(date), "MMMM d, yyyy")} · {readingTime}
    </p>
  );
}
