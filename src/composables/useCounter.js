import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";
import { db } from "@/db";

const COUNTER_NAME = "demo";

async function getCounter() {
  return db.counters.where("name").equals(COUNTER_NAME).first();
}

async function ensureCounter() {
  const counter = await getCounter();

  if (counter) {
    return counter;
  }

  const id = await db.counters.add({ name: COUNTER_NAME, value: 0 });
  return { id, name: COUNTER_NAME, value: 0 };
}

export function useCounter() {
  const count = useObservable(
    liveQuery(async () => (await getCounter())?.value ?? 0),
    { initialValue: 0 },
  );

  async function changeCount(amount) {
    await db.transaction("rw", db.counters, async () => {
      const counter = await ensureCounter();
      await db.counters.update(counter.id, { value: counter.value + amount });
    });
  }

  async function increment() {
    return changeCount(1);
  }

  async function decrement() {
    return changeCount(-1);
  }

  async function reset() {
    await db.transaction("rw", db.counters, async () => {
      const counter = await ensureCounter();
      await db.counters.update(counter.id, { value: 0 });
    });
  }

  return { count, increment, decrement, reset };
}