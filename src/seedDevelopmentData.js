import { db } from "@/db";

export async function seedDevelopmentData() {
  await db.transaction("rw", db.counters, async () => {
    await db.counters.clear();
    await db.counters.add({ name: "demo", value: 0 });
  });
}