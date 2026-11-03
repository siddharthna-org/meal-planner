import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import HomeView from "../HomeView.vue";

describe("Home", () => {
  it("renders the Meal Planner heading", () => {
    const wrapper = mount(HomeView);
    expect(wrapper.get("h1").text()).toBe("Meal Planner");
    expect(wrapper.get("section").attributes("aria-labelledby")).toBe(
      wrapper.get("h1").attributes("id"),
    );
  });

  it("does not render the removed greeting form", () => {
    const wrapper = mount(HomeView);
    expect(wrapper.find("form").exists()).toBe(false);
    expect(wrapper.find("input").exists()).toBe(false);
  });
});
