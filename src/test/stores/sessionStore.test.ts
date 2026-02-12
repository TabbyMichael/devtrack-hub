import { describe, it, expect, vi } from "vitest";
import { useSessionStore } from "@/stores/sessionStore";

describe("sessionStore", () => {
  it("startSession sets activeSession", () => {
    useSessionStore.setState({ activeSession: null });
    useSessionStore.getState().startSession("p1", "Project 1");
    const active = useSessionStore.getState().activeSession;
    expect(active?.projectId).toBe("p1");
    expect(active?.projectName).toBe("Project 1");
    expect(typeof active?.startTime).toBe("string");
  });

  it("stopSession pushes a session with computed duration", () => {
    useSessionStore.setState({ sessions: [], activeSession: null });
    useSessionStore.getState().startSession("p1", "Project 1");
    const startISO = useSessionStore.getState().activeSession!.startTime;
    const startDate = new Date(startISO).getTime();
    const spy = vi.spyOn(Date, "now").mockReturnValue(startDate + 10 * 60 * 1000);
    useSessionStore.getState().stopSession("notes");
    spy.mockRestore();
    const state = useSessionStore.getState();
    expect(state.activeSession).toBeNull();
    expect(state.sessions.length).toBe(1);
    expect(state.sessions[0].duration).toBe(10);
    expect(state.sessions[0].notes).toBe("notes");
    expect(state.sessions[0].projectId).toBe("p1");
  });
});
