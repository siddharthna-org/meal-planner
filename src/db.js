import Dexie from "dexie";

export const db = new Dexie("vue-boilerplate-db");

db.version(1).stores({
  counters: "++id, &name",
});