import {
  PageLoadingSkeleton,
  TableLoadingSkeleton,
  StatCardSkeleton,
} from "@/components/shared/loading-state";

export default function DashboardLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageLoadingSkeleton showHeader={true} showStats={true} statCount={4} />
      
      {/* Recent Members Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <TableLoadingSkeleton rows={5} columns={5} />
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCardSkeleton showIcon={true} showTrend={true} />
        <StatCardSkeleton showIcon={true} showTrend={true} />
        <StatCardSkeleton showIcon={true} showTrend={true} />
      </div>
    </div>
  );
}
