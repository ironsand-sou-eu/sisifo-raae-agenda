import "@testing-library/jest-dom/";
import { render, screen } from "@testing-library/react";
import HeaderFilterHeader from "../../../components/macro/HeaderFilterHeader";

describe("HeaderFilterHeader", () => {
  it("should render a paragraph containing the three deadlines in pt-BR locale string", () => {
    render(<HeaderFilterHeader />);

    const prazoAdmString = new Date(122264547645).toLocaleDateString("pt-BR");
    const prazoFatalString = new Date(122264547645).toLocaleDateString("pt-BR");
    const dataConclusaoString = ` em ${new Date(122264547645).toLocaleDateString("pt-BR")}`;
    expect(screen.getByText(prazoAdmString, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(prazoFatalString, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(dataConclusaoString, { exact: false })).toBeInTheDocument();
    expect(screen.getByText("A cumprir", { exact: false })).toBeInTheDocument();
  });
});
