import { createRequestHandler } from "@remix-run/server-runtime";
import type { ServerPlatform } from "@remix-run/server-runtime";
import { handleAsset } from "@remix-run/cloudflare-workers";

import * as build from "../build";

const platform: ServerPlatform = {};
const requestHandler = createRequestHandler(build, platform);

export async function fetch(request, env, ctx) {
  try {
    const event = {
      request,
      waitUntil(promise) {
        return ctx.waitUntil(promise);
      },
      passThroughOnException() {},
    };
    const assetOptions = {
      ASSET_NAMESPACE: env.__STATIC_CONTENT,
      ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST,
    };
    let response = await handleAsset(event, build, assetOptions);
    if (!response) response = await requestHandler(request, env);
    return response;
  } catch (e: any) {
    return new Response(e.message || e.toString(), {
      status: 500,
    });
  }
}
