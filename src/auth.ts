import NextAuth from "next-auth"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"

const ALLOWED_DOMAINS = ["ssaandco.com", "protective.com"]

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: "https://login.microsoftonline.com/organizations/v2.0",
    }),
  ],
  callbacks: {
    signIn({ profile }) {
      const email = (
        profile?.email ??
        profile?.preferred_username ??
        ""
      ) as string
      if (!email || !email.includes("@")) return false
      const domain = email.split("@")[1]?.toLowerCase()
      return ALLOWED_DOMAINS.includes(domain ?? "")
    },
    jwt({ token, profile }) {
      if (profile) {
        token.name = profile.name
        token.email = (profile.email ?? profile.preferred_username) as string
        token.picture = profile.picture
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.picture as string
      }
      return session
    },
    authorized({ auth: session, request }) {
      const isAuthenticated = !!session?.user
      const isAuthRoute =
        request.nextUrl.pathname.startsWith("/api/auth") ||
        request.nextUrl.pathname.startsWith("/auth")
      if (isAuthRoute) return true
      return isAuthenticated
    },
  },
  pages: {
    error: "/auth/error",
  },
  session: { strategy: "jwt" },
})
