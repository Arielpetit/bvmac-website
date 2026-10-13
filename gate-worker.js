// Worker entry: the OpenNext worker, with the access gate applied to the image optimizer.
// OpenNext answers /_next/image and /cdn-cgi/image before src/proxy.ts runs, so without this
// check any photo could be fetched through those addresses without signing in.
import worker from "./.open-next/worker.js";
import { GATE_COOKIE, verifyGateToken } from "./src/lib/gate.ts";

export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";

const gated = {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (env.GATE_SECRET && (pathname.startsWith("/_next/image") || pathname.startsWith("/cdn-cgi/"))) {
      process.env.GATE_SECRET ??= env.GATE_SECRET;
      const cookies = request.headers.get("cookie") ?? "";
      const token = cookies.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${GATE_COOKIE}=`))?.slice(GATE_COOKIE.length + 1);
      if (!(await verifyGateToken(token))) return new Response("Sign-in required", { status: 401 });
    }
    return worker.fetch(request, env, ctx);
  },
};

export default gated;
