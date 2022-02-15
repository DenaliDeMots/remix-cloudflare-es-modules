import { createRequestHandler } from "@remix-run/server-runtime";
import type { ServerPlatform } from "@remix-run/server-runtime";
import {
  getAssetFromKV,
  MethodNotAllowedError,
  NotFoundError,
} from "@cloudflare/kv-asset-handler";

import * as build from "../build";
import assetJson from "__STATIC_CONTENT_MANIFEST";

const ASSET_MANIFEST = JSON.parse(assetJson);

const platform: ServerPlatform = {};
const requestHandler = createRequestHandler(build, platform);
interface Context {
  waitUntil: (a: Promise<any>) => void;
}
interface Env {
  COUNTER: DurableObjectNamespace;
  __STATIC_CONTENT: any;
}
export async function fetch(request: Request, env: Env, ctx: Context) {
  try {
    let response = await assetHandler(request, env, ctx.waitUntil);
    if (!response) response = await requestHandler(request, env);
    return response;
  } catch (e: any) {
    return new Response(e.message || e.toString(), {
      status: 500,
    });
  }
}

async function assetHandler(
  request: Request,
  env: Env,
  waitUntil: (a: Promise<any>) => void
) {
  try {
    const event = {
      request,
      waitUntil,
    };
    const options = {
      ASSET_NAMESPACE: env.__STATIC_CONTENT,
      ASSET_MANIFEST,
      cacheControl: {
        bypassCache: true, // required until this issue gets resolved https://github.com/cloudflare/kv-asset-handler/issues/274
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
