import { Filter } from "../components/hooks/FiltersProvider";

const filterMock: Filter[] = [
  {
    categoria: "TAREFA",
    index: 1,
    filterName: "Todas da semana",
    situacoes: [
      {
        codigoTarefaTipo: 1,
        nomeTipoTarefa: "A cumprir",
      },
      {
        codigoTarefaTipo: 2,
        nomeTipoTarefa: "Cumprida",
      },
    ],
    dates: [new Date("2023-12-01"), new Date("2023-12-10")],
  },
  {
    categoria: "TAREFA",
    index: 2,
    filterName: "Cumpridas hoje",
    situacoes: [
      {
        codigoTarefaTipo: 2,
        nomeTipoTarefa: "Cumprida",
      },
    ],
    dates: [new Date(), new Date()],
  },
];

export default filterMock;
