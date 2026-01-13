import {
  PageLoadingSkeleton,
  FormLoadingSkeleton,
} from "@/components/shared/loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function BackupLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageLoadingSkeleton showHeader={true} showStats={false} showTable={false} />
      
      {/* Backup Options Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 p-6 border rounded-lg">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4 p-6 border rounded-lg">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      
      {/* Backup History Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
              <Skeleton className="h-10 w-10 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
