import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthStore } from "@/stores/authStore";

describe("ProtectedRoute", () => {
  it("renders children when authenticated", () => {
    useAuthStore.setState({ isAuthenticated: true, user: { id: "1", name: "dev", email: "dev@example.com" }, isLoading: false });
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div data-testid="protected">protected</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId("protected")).toBeInTheDocument();
  });
});
