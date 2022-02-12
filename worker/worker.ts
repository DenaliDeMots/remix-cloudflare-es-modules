import { createRequestHandler } from "@remix-run/server-runtime";
import type { ServerPlatform } from "@remix-run/server-runtime";
import {
  getAssetFromKV,
  MethodNotAllowedError,
  NotFoundError,
} from "@cloudflare/kv-asset-handler";
import * as build from "../build";
import assetJson from "__STATIC_CONTENT_MANIFEST";
const ASSET_MANIFEST = JSON.parse(assetJson.default);

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
      ASSET_MANIFEST,
      cacheControl: {
        bypassCache: true,
      },
    };

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
