import { createRequestHandler } from "@remix-run/server-runtime";
import type { ServerPlatform } from "@remix-run/server-runtime";
import {
  getAssetFromKV,
  MethodNotAllowedError,
  NotFoundError,
} from "@cloudflare/kv-asset-handler";
import * as build from "../build";

const ASSET_PATH = build.assets.url.split("/").slice(0, -1).join("/");

const platform: ServerPlatform = {};
const requestHandler = createRequestHandler(build, platform);

export async function fetch(request, env, ctx) {
  try {
    let response = await handleAsset(request, env, ctx.waitUntil);
    if (!response) response = await requestHandler(request, env);
    return response;
  } catch (e: any) {
    return new Response(e.message || e.toString(), {
      status: 500,
    });
  }
}

async function handleAsset(request, env, waitUntil) {
  try {
    const event = {
      request,
      waitUntil,
    };
    const options = {
      ASSET_NAMESPACE: env.__STATIC_CONTENT,
      ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST,
    };
    if (process.env.NODE_ENV === "development") {
      return await getAssetFromKV(event, {
        cacheControl: {
          bypassCache: true,
        },
        ...options,
      });
    }

    const pathname = new URL(request.url).pathname;
    if (pathname.startsWith(ASSET_PATH)) {
      return await getAssetFromKV(event, {
        cacheControl: {
          edgeTTL: 31536000,
          browserTTL: 31536000,
        },
        ...options,
      });
    }

    return await getAssetFromKV(event, options);
  } catch (error) {
    if (
      error instanceof MethodNotAllowedError ||
      error instanceof NotFoundError
    ) {
      return null;
    }

    throw error;
  }
}
