import {
  PageLoadingSkeleton,
  TableLoadingSkeleton,
} from "@/components/shared/loading-state";

export default function DonationsListLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageLoadingSkeleton showHeader={true} showStats={false} />
      <TableLoadingSkeleton rows={10} columns={7} />
    </div>
  );
}
