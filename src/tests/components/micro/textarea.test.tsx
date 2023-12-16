import "@testing-library/jest-dom/";
import { render, screen } from "@testing-library/react";
import Textarea from "../../../components/micro/Textarea";

describe("Textarea", () => {
  beforeEach(() => {
    render(<Textarea nameAndId={"test-textarea"} label={"My textarea label"} content="Test content" />);
  });

  it("should render a textarea element with name, id and label passed as props", () => {
    const txtarea = screen.getByRole("textbox");
    expect(txtarea).toBeInTheDocument();
    expect(txtarea).toHaveAttribute("name", "test-textarea");
    expect(txtarea).toHaveAttribute("id", "test-textarea");
    expect(screen.getByLabelText("My textarea label")).toBeInTheDocument();
  });

  it("should have provided content", () => {
    expect(screen.getByLabelText("My textarea label").textContent).toBe("Test content");
  });
});
