import { redirect } from "next/navigation";

type AcceptInvitePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AcceptInvitePage({
  searchParams,
}: AcceptInvitePageProps) {
  const params = searchParams ? await searchParams : {};
  const next = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined) next.append(key, item);
      }
      continue;
    }

    if (value !== undefined) next.set(key, value);
  }

  const query = next.toString();
  redirect(query ? `/sign-up?${query}` : "/sign-in");
}
