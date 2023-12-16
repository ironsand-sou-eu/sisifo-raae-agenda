import "@testing-library/jest-dom/";
import { render, screen } from "@testing-library/react";
import HeaderButton from "../../../components/micro/HeaderButton";

describe("HeaderButton", () => {
  it("should render the element", () => {
    render(<HeaderButton type="cancel" title="teste-btn" onClick={() => {}} />);
    expect(screen.getByTitle("teste-btn")).toBeInTheDocument();
  });

  it("rendered element's svg path should have className equal to type property", () => {
    render(<HeaderButton type="cancel" title="teste-btn" onClick={() => {}} />);
    const path = screen.getByTitle("teste-btn").querySelector("svg path")!;
    expect(path).toHaveAttribute("class", "cancel");
  });

  it("color and title provided, should render the same color and title", () => {
    render(<HeaderButton type="conclude" title="Nosso teste" rgbaColor="#fff" onClick={() => {}} />);
    const div = screen.getByTitle("Nosso teste");
    const doc = div.ownerDocument.documentElement;

    expect(div).toHaveAttribute("title", "Nosso teste");
    expect(getComputedStyle(doc).getPropertyValue("--fill-color-conclude")).toBe("#fff");
  });

  it("title not provided, should render some standard title", () => {
    render(<HeaderButton type="filter" onClick={() => {}} />);

    const div = screen.getByRole("button");
    expect(div.getAttribute("title")).not.toBe("");
  });

  it("should dispatch the onClick", () => {
    const testCb = jest.fn(() => {});
    render(<HeaderButton type="conclude" title="teste-btn" onClick={testCb} />);
    const div = screen.getByTitle("teste-btn");
    div.click();

    expect(testCb).toHaveBeenCalled();
  });
});
