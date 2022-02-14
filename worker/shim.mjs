import worker from "worker.js";

export default {
  fetch: worker.fetch,
};

export const PageCount = worker.PageCount;
