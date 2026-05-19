const DEFAULT_API_BASE_URL = "https://api.prod.dardoc.com";
const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/+$/, "");

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

function requireApiBaseUrl() {
  if (!apiBaseUrl) throw new Error("api_base_url_missing");
  return apiBaseUrl;
}

function proxyHeaders(request: Request) {
  const headers = new Headers();
  const accept = request.headers.get("accept");
  const authorization = request.headers.get("authorization");
  const contentType = request.headers.get("content-type");

  if (accept) headers.set("accept", accept);
  if (authorization) headers.set("authorization", authorization);
  if (contentType) headers.set("content-type", contentType);
  headers.set("ngrok-skip-browser-warning", "1");

  return headers;
}

async function proxyGet(request: Request, context: RouteContext) {
  const { path } = await context.params;
  const requestUrl = new URL(request.url);
  const upstreamPath = path.map((part) => encodeURIComponent(part)).join("/");
  const upstreamUrl = `${requireApiBaseUrl()}/${upstreamPath}${requestUrl.search}`;

  const upstream = await fetch(upstreamUrl, {
    cache: "no-store",
    headers: proxyHeaders(request),
  });

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  const contentDisposition = upstream.headers.get("content-disposition");

  if (contentType) headers.set("content-type", contentType);
  if (contentDisposition) headers.set("content-disposition", contentDisposition);
  headers.set("cache-control", "no-store");

  return new Response(await upstream.arrayBuffer(), {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}

export async function GET(request: Request, context: RouteContext) {
  try {
    return await proxyGet(request, context);
  } catch (error) {
    return Response.json(
      {
        error: "backend_proxy_failed",
        detail: error instanceof Error ? error.message : "unknown_error",
      },
      { status: 502 }
    );
  }
}

async function proxyPost(request: Request, context: RouteContext) {
  const { path } = await context.params;
  const upstreamPath = path.map((part) => encodeURIComponent(part)).join("/");
  const upstreamUrl = `${requireApiBaseUrl()}/${upstreamPath}`;

  const upstream = await fetch(upstreamUrl, {
    method: "POST",
    cache: "no-store",
    headers: proxyHeaders(request),
    body: await request.text(),
  });

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  headers.set("cache-control", "no-store");

  return new Response(await upstream.arrayBuffer(), {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}

export async function POST(request: Request, context: RouteContext) {
  try {
    return await proxyPost(request, context);
  } catch (error) {
    return Response.json(
      {
        error: "backend_proxy_failed",
        detail: error instanceof Error ? error.message : "unknown_error",
      },
      { status: 502 }
    );
  }
}
