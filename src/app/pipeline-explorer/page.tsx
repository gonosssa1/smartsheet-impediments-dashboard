import Link from "next/link";
import PipelineExplorer from "@/components/pipeline/PipelineExplorer";

export const metadata = {
  title: "Pipeline Explorer | Impediments Dashboard",
};

export default function PipelineExplorerPage() {
  return (
    <div className="relative">
      <Link
        href="/"
        className="fixed left-4 top-4 z-50 inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-md backdrop-blur transition-colors hover:bg-white"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Dashboard
      </Link>
      <PipelineExplorer />
    </div>
  );
}
