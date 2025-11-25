import { render, screen } from "@testing-library/react";
import App from "../../src/App";

describe("Frontend Load", () => {
  it("renders initial application name", () => {
    render(<App />);
    expect(screen.getByText(/CarrerFlow/i)).toBeDefined();
  });
});
