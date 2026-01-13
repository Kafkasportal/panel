import {
  PageLoadingSkeleton,
  TableLoadingSkeleton,
  StatCardSkeleton,
} from "@/components/shared/loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function VezneLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageLoadingSkeleton showHeader={true} showStats={false} />
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton showIcon={true} showTrend={true} />
        <StatCardSkeleton showIcon={true} showTrend={true} />
        <StatCardSkeleton showIcon={true} showTrend={true} />
        <StatCardSkeleton showIcon={true} showTrend={true} />
      </div>
      
      {/* Filters Skeleton */}
      <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
      
      <TableLoadingSkeleton rows={10} columns={7} />
    </div>
  );
}
