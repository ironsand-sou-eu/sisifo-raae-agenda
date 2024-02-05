// import "@testing-library/jest-dom/";
// import { render, screen } from "@testing-library/react";
// import ProcessoInfoCard from "../../../components/micro/ProcessoInfoCard";

// describe("ProcessoInfoCard", () => {
//   it("should render a textarea element with name, id and label passed as props", () => {
//     render(
//       <ProcessoInfoCard
//         parteAtiva="FIRST PERSON"
//         partePassiva="SECOND PERSON"
//         numeroProcesso="0000000-00.0000.0.00.0000"
//         codigoProcessoProjuris={1234567}
//       />
//     );

//     const link = screen.getByText("0000000-00.0000.0.00.0000");
//     expect(screen.getByText("FIRST PERSON")).toBeInTheDocument();
//     expect(screen.getByText("SECOND PERSON")).toBeInTheDocument();
//     expect(link).toBeInTheDocument();
//     expect(link).toHaveAttribute("href");
//     expect(link).not.toHaveAttribute("href", "");
//   });

//   it("should render a link with empty href if not provided codigoProcessoProjuris", () => {
//     render(
//       <ProcessoInfoCard
//         parteAtiva={"FIRST PERSON"}
//         partePassiva={"SECOND PERSON"}
//         numeroProcesso={"0000000-00.0000.0.00.0000"}
//       />
//     );

//     const link = screen.getByText("0000000-00.0000.0.00.0000");
//     expect(link).toHaveAttribute("href", "");
//   });
// });
