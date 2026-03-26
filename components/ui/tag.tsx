type TagProps = {
  label: string;
};

export function Tag({ label }: TagProps) {
  return (
    <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
      {label}
    </span>
  );
}
