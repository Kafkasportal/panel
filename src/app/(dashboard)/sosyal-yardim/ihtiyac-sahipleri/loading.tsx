import {
  PageLoadingSkeleton,
  TableLoadingSkeleton,
} from "@/components/shared/loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function BeneficiariesLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageLoadingSkeleton showHeader={true} showStats={false} />
      
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
