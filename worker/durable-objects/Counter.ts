import { json } from "remix";

interface Env {}

export class Counter {
  state: DurableObjectState;
  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
  }

  async fetch(request: Request) {
    switch (new URL(request.url).pathname) {
      case "/increment":
        this.increment();
        break;
    }

    return json(await this.getCount());
  }

  async getCount() {
    let count: number = await this.state.storage.get("count");
    if (!count) {
      count = 0;
      this.setCount(count);
    }
    return count;
  }

  setCount(val: number) {
    return this.state.storage.put("count", val);
  }

  async increment() {
    this.setCount((await this.getCount()) + 1);
  }
}
