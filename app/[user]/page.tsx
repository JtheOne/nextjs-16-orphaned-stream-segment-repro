import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function fetchUser(username: string) {
  await new Promise((r) => setTimeout(r, 50));
  return { username, bio: "A minimal repro user." };
}

export default async function UserPage({ params }: { params: Promise<{ user: string }> }) {
  const { user } = await params;
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value ?? "light";
  const data = await fetchUser(user);

  return (
    <main>
      <h1>{data.username}&apos;s page (theme: {theme})</h1>
      <p>{data.bio}</p>
      <form>
        <label>
          Title
          <input type="text" name="title" />
        </label>
        <label>
          Notes
          <textarea name="notes" />
        </label>
        <button type="submit">Save</button>
      </form>
    </main>
  );
}
