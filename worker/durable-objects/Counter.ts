// A simple
export class Counter {
  state: DurableObjectState;
  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
  }

  async fetch(request: Request) {
    let count: number = (await this.state.storage.get("count")) || 0;
    count++;
    await this.state.storage.put("count", count);
    return new Response(JSON.stringify(count));
  }
}

interface Env {}
