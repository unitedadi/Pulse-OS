import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

const PULSE_ACCOUNT_SELECTOR_COOKIE_NAME = "pulse_os_account_id";

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

function accountSelectorEnabled() {
  return String(process.env.PULSE_OS_ACCOUNT_SELECTOR_ENABLED ?? "true")
    .trim()
    .toLowerCase() !== "false";
}

function hasPulseAccountSelector(request: NextRequest) {
  const url = new URL(request.url);
  const accountId = String(
    url.searchParams.get("account_id") ??
      request.cookies.get(PULSE_ACCOUNT_SELECTOR_COOKIE_NAME)?.value ??
      ""
  )
    .trim()
    .toLowerCase();
  return accountSelectorEnabled() && accountId.startsWith("mp_");
}

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request) && !hasPulseAccountSelector(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
