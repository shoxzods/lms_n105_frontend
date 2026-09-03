export function StatCard({
  value,
  label,
  isLoading = false,
}: {
  value: number | string;
  label: string;
  isLoading?: boolean;
}) {
  return (
    <div className="flex h-[94px] min-w-0 w-full flex-col justify-center gap-1.5 rounded-[10px] bg-card px-4 py-3.5 shadow-sm">
      {isLoading ? (
        <div className="h-7 w-12 animate-pulse rounded bg-hover" />
      ) : (
        <p className="text-2xl font-bold text-page-fg">{value}</p>
      )}
      <p className="truncate text-sm xl:text-[15px] font-medium text-page-fg" title={label}>
        {label}
      </p>
    </div>
  );
}
