export default function LoadingSpinner() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-[3px] border-brand-nepal/30" />
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-brand-blue" />
        </div>
        <p className="text-sm font-medium tracking-wide text-brand-nepal">
          Loading impediments...
        </p>
      </div>
    </div>
  );
}
