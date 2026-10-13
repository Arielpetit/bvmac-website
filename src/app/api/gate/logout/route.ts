import { gateCookie } from "@/lib/gate";

export async function GET() {
  return new Response(null, { status: 303, headers: { Location: "/login", "Set-Cookie": gateCookie("", 0, true), "Cache-Control": "no-store" } });
}
