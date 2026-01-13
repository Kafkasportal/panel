import {
  PageLoadingSkeleton,
  CardLoadingSkeleton,
  StatCardSkeleton,
} from "@/components/shared/loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function KumbaraLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageLoadingSkeleton showHeader={true} showStats={false} />
      
      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <div className="flex gap-2 border-b">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCardSkeleton showIcon={true} showTrend={true} />
          <StatCardSkeleton showIcon={true} showTrend={true} />
          <StatCardSkeleton showIcon={true} showTrend={true} />
          <StatCardSkeleton showIcon={true} showTrend={true} />
        </div>
        
        {/* Cards Grid */}
        <CardLoadingSkeleton count={6} showHeader={true} showContent={true} />
      </div>
    </div>
  );
}
