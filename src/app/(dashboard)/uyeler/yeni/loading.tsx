import {
  PageLoadingSkeleton,
  FormLoadingSkeleton,
} from "@/components/shared/loading-state";

export default function NewMemberLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageLoadingSkeleton showHeader={true} showStats={false} showTable={false} />
      <div className="max-w-2xl">
        <FormLoadingSkeleton fields={8} hasSubmitButton={true} />
      </div>
    </div>
  );
}
