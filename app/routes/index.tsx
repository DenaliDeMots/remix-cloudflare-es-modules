import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";

export const loader: LoaderFunction = async ({ context }) => {
  const id = context.COUNTER.idFromName("home page count");
  const pageCount = context.COUNTER.get(id);
  const count = await pageCount.fetch("/increment");
  return count.json();
};

export default function Index() {
  const count = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <h2>You're vistior number: {count}!</h2>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
