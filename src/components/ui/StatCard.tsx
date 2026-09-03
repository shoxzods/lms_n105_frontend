/** Figma: "numbers" kartasi (37:980) — 94px balandlik, min 294.4px kenglik */
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
    <div className="flex h-[94px] min-w-[294.4px] flex-1 flex-col justify-center gap-2 rounded-[10px] bg-card p-5">
      {isLoading ? (
        <div className="h-7 w-12 animate-pulse rounded bg-hover" />
      ) : (
        <p className="text-2xl font-bold text-page-fg">{value}</p>
      )}
      <p className="text-base font-medium text-page-fg">{label}</p>
    </div>
  );
}
