import "@testing-library/jest-dom/";
import { render, screen } from "@testing-library/react";
import PrazosCard from "../../../components/micro/PrazosCard.1";

describe("ProcessoInfoCard", () => {
  it("should render a paragraph containing the three deadlines in pt-BR locale string", () => {
    render(<PrazosCard situacao="A cumprir" dataConclusao={122264547645} dataConclusaoPrevista={122264547645} dataLimite={122264547645} />);

    const prazoAdmString = new Date(122264547645).toLocaleDateString("pt-BR");
    const prazoFatalString = new Date(122264547645).toLocaleDateString("pt-BR");
    const dataConclusaoString = ` em ${new Date(122264547645).toLocaleDateString("pt-BR")}`;
    expect(screen.getByText(prazoAdmString, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(prazoFatalString, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(dataConclusaoString, { exact: false })).toBeInTheDocument();
    expect(screen.getByText("A cumprir", { exact: false })).toBeInTheDocument();
  });

  it("should render a link with empty href if not provided codigoProcessoProjuris", () => {
    render(<PrazosCard />);

    expect(screen.getByText(/Prazo: Não encontrado/i)).toBeInTheDocument();
    expect(screen.getByText(/Fatal: Não encontrado/i)).toBeInTheDocument();
    expect(screen.getByText(/Situação: Não encontrada/i)).toBeInTheDocument();
    expect(screen.queryByText(content => content.includes("encontrada em"))).toBe(null);
  });

  it("should render lost deadlines with the class 'lost'", () => {
    render(<PrazosCard situacao="A cumprir" dataConclusaoPrevista={new Date("2023-05-22").getTime()} />);

    expect(screen.getByText(/A cumprir/i)).toHaveAttribute("class", expect.stringContaining("lost"));
  });

  it("should render two-days-due deadlines with the class 'warning'", () => {
    const tomorrow = new Date().getTime() + 1 * 24 * 60 * 60 * 1000;
    render(<PrazosCard situacao="A cumprir" dataConclusaoPrevista={new Date(tomorrow).getTime()} />);

    expect(screen.getByText(/A cumprir/i)).toHaveAttribute("class", expect.stringContaining("warning"));
  });

  it("should render two-days-due deadlines with the class 'danger'", () => {
    render(<PrazosCard situacao="A cumprir" dataConclusaoPrevista={new Date().getTime()} />);

    expect(screen.getByText(/A cumprir/i)).toHaveAttribute("class", expect.stringContaining("danger"));
  });

  it("should render undefined deadlines with the class 'danger'", () => {
    render(<PrazosCard situacao="A cumprir" />);

    expect(screen.getByText(/A cumprir/i)).toHaveAttribute("class", expect.stringContaining("danger"));
  });

  it("should render deadlines more than 2 days in the future with the class 'normal'", () => {
    const tenDaysFromNow = new Date().getTime() + 10 * 24 * 60 * 60 * 1000;
    render(<PrazosCard situacao="A cumprir" dataConclusaoPrevista={new Date(tenDaysFromNow).getTime()} />);

    expect(screen.getByText(/A cumprir/i)).toHaveAttribute("class", expect.stringContaining("normal"));
  });
});
