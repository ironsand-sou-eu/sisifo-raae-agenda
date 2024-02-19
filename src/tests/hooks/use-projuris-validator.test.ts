// import "@testing-library/jest-dom/";
// import useProjurisValidator from "../../components/hooks/useProjurisValidator";
// import { WritingAndamento } from "../../global";
// import { useMessageGenerator } from "../../components/hooks/useMessageGenerator";

// describe("useProjurisValidator", () => {
//   describe("andamentos", () => {
//     const { validateAndamento } = useProjurisValidator();
//     const { generateStringMsg } = useMessageGenerator();

//     const andamento: WritingAndamento = {
//       dataAndamento: "2024-02-06T20:19:57.241Z",
//       horaAndamento: "2024-02-06T20:19:57.241Z",
//       codigoTipoAndamento: 240849,
//       responsaveis: [
//         {
//           chave: 89323,
//           valor: "CÉSAR BRAGA LINS BAMBERG RODRIGUEZ",
//         },
//       ],
//       descricaoAndamento: "Minha descrição teste",
//       privado: true,
//       modulos: [
//         {
//           modulo: "PROCESSO",
//           codigoRegistroVinculo: 17664534,
//           vinculoPrincipal: true,
//         },
//       ],
//     };

//     it("should return true to a complete WritingAndamento object", () => {
//       expect(validateAndamento(andamento)).toBeTruthy();
//     });

//     fit("should throw an error to an incomplete WritingAndamento object", () => {
//       const andamentoClone: any = {
//         ...andamento,
//         modulos: [{ modulo: "oxe", codigoRegistroVinculo: 17664534, vinculoPrincipal: "true" }],
//       };
//       // validateAndamento(andamentoClone as WritingAndamento);
//       // expect(resp).toThrow(
//       //   generateStringMsg.missingProps([missingProp], "andamento")
//       // );
//     });

//     it("should throw an error to a no-WritingAndamento object", () => {
//       const andamentoClone = { test: "1", clear: 3 };
//       expect(() => validateAndamento(andamentoClone as unknown as WritingAndamento)).toThrow(
//         generateStringMsg.missingProps(
//           ["dataAndamento", "codigoTipoAndamento", "responsaveis", "descricaoAndamento", "privado", "modulos"],
//           "andamento"
//         )
//       );
//     });

//     // it("should throw an error to an incomplete WritingAndamento object", () => {
//     //   const andamentoClone: Partial<WritingAndamento> = { ...andamento, responsaveis: [{ valor: "César" }] };
//     //   const missingProp = "responsaveis[0].chave";
//     //   expect(validateAndamento(andamentoClone as WritingAndamento)).toThrow(
//     //     generateStringMsg.missingProps([missingProp], "andamento")
//     //   );
//     // });
//   });
// });
