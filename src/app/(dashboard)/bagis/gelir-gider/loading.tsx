import {
  PageLoadingSkeleton,
  TableLoadingSkeleton,
  StatCardSkeleton,
} from "@/components/shared/loading-state";

export default function GelirGiderLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageLoadingSkeleton showHeader={true} showStats={true} statCount={4} />
      <TableLoadingSkeleton rows={8} columns={6} />
    </div>
  );
}
