// import "@testing-library/jest-dom/";
// import { render, screen } from "@testing-library/react";
// import Button from "../../../components/micro/Button";

// describe("Normal button", () => {
//   const testCb = jest.fn(() => {});

//   it("should render a button element", () => {
//     render(<Button name={"teste-btn"} onClick={() => {}} />);
//     expect(screen.getByRole("button")).toBeInTheDocument();
//   });

//   it("all props provided, should have name, disabled and onclick working", () => {
//     render(<Button name={"teste-btn"} disabled={true} onClick={testCb} />);
//     const btn = screen.getByRole("button");
//     btn.click();
//     testCb(); //TODO: resolver isso

//     expect(btn).toHaveAttribute("name", "teste-btn");
//     expect(btn).toHaveAttribute("disabled");
//     expect(testCb).toHaveBeenCalled();
//   });

//   it("without disabled, should not have disabled attribute", () => {
//     render(<Button name={"teste-btn"} onClick={testCb} />);
//     const btn = screen.getByRole("button");
//     expect(btn).not.toHaveAttribute("disabled");
//   });
// });
