import { describe, it, expect } from "vitest";
import { useAuthStore } from "@/stores/authStore";

describe("authStore", () => {
  it("register authenticates and sets user", async () => {
    const email = "dev@example.com";
    const name = "dev";
    await useAuthStore.getState().register(name, email, "password");
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe(email);
    expect(state.user?.name).toBe(name);
  });

  it("login authenticates and sets user from email local-part", async () => {
    const email = "jane@example.com";
    await useAuthStore.getState().login(email, "password");
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe(email);
    expect(state.user?.name).toBe("jane");
  });

  it("logout clears user and authentication", async () => {
    await useAuthStore.getState().login("dev@example.com", "password");
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});
