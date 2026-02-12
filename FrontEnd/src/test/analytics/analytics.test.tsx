import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Analytics from "@/pages/Analytics";
import { useSessionStore } from "@/stores/sessionStore";

describe("Analytics streak", () => {
  it("shows streak days based on consecutive session dates", () => {
    const today = new Date();
    const isoFor = (offset: number) => {
      const d = new Date(today);
      d.setDate(today.getDate() - offset);
      return d.toISOString().split("T")[0];
    };
    const sessions = [
      { id: "a", projectId: "1", projectName: "DevTrack", startTime: isoFor(0) + "T09:00:00", endTime: isoFor(0) + "T10:00:00", duration: 60 },
      { id: "b", projectId: "1", projectName: "DevTrack", startTime: isoFor(1) + "T09:00:00", endTime: isoFor(1) + "T10:00:00", duration: 60 },
      { id: "c", projectId: "1", projectName: "DevTrack", startTime: isoFor(2) + "T09:00:00", endTime: isoFor(2) + "T10:00:00", duration: 60 },
    ];
    useSessionStore.setState({ sessions, activeSession: null });
    render(
      <MemoryRouter initialEntries={["/analytics"]}>
        <Routes>
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/3 days/)).toBeInTheDocument();
  });
});
