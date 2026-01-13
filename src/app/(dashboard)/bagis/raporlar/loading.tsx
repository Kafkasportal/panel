import {
  PageLoadingSkeleton,
  ChartLoadingSkeleton,
  StatCardSkeleton,
} from "@/components/shared/loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageLoadingSkeleton showHeader={true} showStats={false} />
      
      {/* Filters Skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton showIcon={true} showTrend={true} />
        <StatCardSkeleton showIcon={true} showTrend={true} />
        <StatCardSkeleton showIcon={true} showTrend={true} />
        <StatCardSkeleton showIcon={true} showTrend={true} />
      </div>
      
      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartLoadingSkeleton height={300} showLegend={true} />
        <ChartLoadingSkeleton height={300} showLegend={true} />
      </div>
      
      <ChartLoadingSkeleton height={400} showLegend={true} />
    </div>
  );
}
