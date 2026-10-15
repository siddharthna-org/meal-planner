import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import HomeView from "../HomeView.vue";

const { invoke, getSupabaseClient } = vi.hoisted(() => ({
  invoke: vi.fn(),
  getSupabaseClient: vi.fn(),
}));
vi.mock("@/lib/supabase", () => ({ getSupabaseClient }));

beforeEach(() => {
  invoke.mockReset();
  getSupabaseClient.mockReset().mockReturnValue({ functions: { invoke } });
});

async function submit(wrapper, name = " Ada ") {
  await wrapper.get("input").setValue(name);
  await wrapper.get("form").trigger("submit");
}

describe("Home greeting", () => {
  it("renders without connecting to Supabase", () => {
    const wrapper = mount(HomeView);
    expect(wrapper.get("label").attributes("for")).toBe(
      wrapper.get("input").attributes("id"),
    );
    expect(getSupabaseClient).not.toHaveBeenCalled();
  });

  it("invokes the function with a trimmed name and displays its response", async () => {
    invoke.mockResolvedValue({ data: { message: "Hello Ada!" }, error: null });
    const wrapper = mount(HomeView);
    await submit(wrapper);
    await flushPromises();
    expect(invoke).toHaveBeenCalledExactlyOnceWith("hello-world", {
      body: { name: "Ada" },
    });
    expect(wrapper.get('[data-testid="greeting-result"]').text()).toContain(
      "Hello Ada!",
    );
  });

  it("disables the form and prevents duplicate submissions while pending", async () => {
    let resolveRequest;
    invoke.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );
    const wrapper = mount(HomeView);
    await submit(wrapper);
    expect(wrapper.get("button").attributes("disabled")).toBeDefined();
    expect(wrapper.get("input").attributes("disabled")).toBeDefined();
    await wrapper.get("form").trigger("submit");
    expect(invoke).toHaveBeenCalledOnce();
    resolveRequest({ data: { message: "Hello Ada!" }, error: null });
    await flushPromises();
    expect(wrapper.get("button").attributes("disabled")).toBeUndefined();
  });

  it.each(["", "   ", "a".repeat(101)])(
    "rejects invalid names",
    async (name) => {
      const wrapper = mount(HomeView);
      await submit(wrapper, name);
      expect(wrapper.text()).toContain("between 1 and 100");
      expect(invoke).not.toHaveBeenCalled();
    },
  );

  it("shows missing-configuration errors without breaking the page", async () => {
    getSupabaseClient.mockImplementation(() => {
      throw new Error("Configure .env.local");
    });
    const wrapper = mount(HomeView);
    await submit(wrapper);
    expect(wrapper.text()).toContain("Configure .env.local");
    expect(wrapper.get("button").attributes("disabled")).toBeUndefined();
  });

  it("shows function errors and allows retry", async () => {
    invoke.mockResolvedValueOnce({
      data: null,
      error: new Error("Function unavailable"),
    });
    const wrapper = mount(HomeView);
    await submit(wrapper);
    await flushPromises();
    expect(wrapper.text()).toContain("Function unavailable");
    invoke.mockResolvedValueOnce({
      data: { message: "Hello Ada!" },
      error: null,
    });
    await submit(wrapper);
    await flushPromises();
    expect(wrapper.text()).not.toContain("Function unavailable");
    expect(wrapper.text()).toContain("Hello Ada!");
  });

  it("rejects unexpected response data", async () => {
    invoke.mockResolvedValue({ data: {}, error: null });
    const wrapper = mount(HomeView);
    await submit(wrapper);
    await flushPromises();
    expect(wrapper.text()).toContain("unexpected response");
  });
});
