import { createRequestHandler } from "@remix-run/server-runtime";

import * as build from "../build";

const requestHandler = createRequestHandler(build, {});

export async function fetch(request, env) {
  try {
    return requestHandler(request, env);
  } catch (e: any) {
    return new Response(e.message || e.toString(), {
      status: 500,
    });
  }
}
