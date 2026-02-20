import Link from "next/link"

export default async function AuthError({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const isAccessDenied = error === "AccessDenied"

  const title = isAccessDenied ? "Access Denied" : "Authentication Error"
  const message = isAccessDenied
    ? "This dashboard is restricted to SSA&Co and Protective Life employees. Please sign in with your organization email."
    : "An error occurred during sign-in. Please try again or contact your administrator."

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-7 w-7 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <h1 className="mb-2 text-xl font-bold text-gray-900">{title}</h1>
        <p className="mb-6 text-sm text-gray-600">{message}</p>
        <Link
          href="/api/auth/signin"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
        >
          Try Again
        </Link>
      </div>
    </div>
  )
}
