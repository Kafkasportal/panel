import {
  PageLoadingSkeleton,
  ChartLoadingSkeleton,
  StatCardSkeleton,
} from "@/components/shared/loading-state";

export default function StatisticsLoading() {
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
      
      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartLoadingSkeleton height={300} showLegend={true} />
        <ChartLoadingSkeleton height={300} showLegend={true} />
      </div>
      
      <ChartLoadingSkeleton height={400} showLegend={true} />
    </div>
  );
}
