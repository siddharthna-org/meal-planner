import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import { vi } from "vitest";
import DemoCounter from "../DemoCounter.vue";

const counter = {
  count: ref(0),
  increment: vi.fn(),
  decrement: vi.fn(),
  reset: vi.fn(),
};

vi.mock("@/composables/useCounter", () => ({
  useCounter: () => counter,
}));

function mountWithCount(count = 0) {
  counter.count.value = count;
  counter.increment.mockClear();
  counter.decrement.mockClear();
  counter.reset.mockClear();

  return {
    wrapper: mount(DemoCounter),
  };
}

describe("DemoCounter", () => {
  it("renders the current count", () => {
    const { wrapper } = mountWithCount(5);
    expect(wrapper.text()).toContain("5");
  });

  it("increments when + is clicked", async () => {
    const { wrapper } = mountWithCount();
    await wrapper.find("button.btn-primary").trigger("click");
    expect(counter.increment).toHaveBeenCalledOnce();
  });

  it("decrements when − is clicked", async () => {
    const { wrapper } = mountWithCount();
    await wrapper.find("button.btn-outline-secondary").trigger("click");
    expect(counter.decrement).toHaveBeenCalledOnce();
  });

  it("resets when Reset is clicked", async () => {
    const { wrapper } = mountWithCount(3);
    await wrapper.find("button.btn-outline-danger").trigger("click");
    expect(counter.reset).toHaveBeenCalledOnce();
  });
});
