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

const unorderedFilterObj: Filter = {
  categoria: "TAREFA",
  index: 3,
  filterName: "Filtro teste",
  quadroKanban: {
    chave: 2,
    valor: "EMPRESARIAL",
  },
  colunaKanban: {
    chave: 8,
    valor: "ongoing",
  },
  tipos: [
    {
      chave: 12,
      valor: "Agravo de Intrumento",
    },
    {
      chave: 37,
      valor: "Petição simples",
    },
  ],
  responsaveis: [
    {
      chave: 4657,
      valor: "CÉSAR BRAGA LINS BAMBERG RODRIGUEZ",
    },
    {
      chave: 124,
      valor: "RUY AMARAL ANDRADE",
    },
    {
      chave: 6314,
      valor: "YASMIN PINHO",
    },
  ],
  gruposTrabalho: [
    {
      chave: 3,
      valor: "Corporativo",
    },
    {
      chave: 8,
      valor: "Le Biscuit",
    },
  ],
  situacoes: [
    {
      codigoTarefaTipo: 6,
      nomeTipoTarefa: "A cumprir",
    },
  ],
  dates: [new Date("2023-12-26"), new Date("2023-11-15")],
};

const orderedFilterObj: Filter = {
  index: 3,
  gruposTrabalho: [
    {
      chave: 3,
      valor: "Corporativo",
    },
    {
      chave: 8,
      valor: "Le Biscuit",
    },
  ],
  filterName: "Filtro teste",
  quadroKanban: {
    chave: 2,
    valor: "EMPRESARIAL",
  },
  colunaKanban: {
    chave: 8,
    valor: "ongoing",
  },
  responsaveis: [
    {
      chave: 4657,
      valor: "CÉSAR BRAGA LINS BAMBERG RODRIGUEZ",
    },
    {
      chave: 124,
      valor: "RUY AMARAL ANDRADE",
    },
    {
      chave: 6314,
      valor: "YASMIN PINHO",
    },
  ],
  categoria: "TAREFA",
  tipos: [
    {
      chave: 12,
      valor: "Agravo de Intrumento",
    },
    {
      chave: 37,
      valor: "Petição simples",
    },
  ],
  situacoes: [
    {
      codigoTarefaTipo: 6,
      nomeTipoTarefa: "A cumprir",
    },
  ],
  dates: [new Date("2023-12-26"), new Date("2023-11-15")],
};

const expectedJson =
  '{"categoria":"TAREFA","colunaKanban":{"chave":8,"valor":"ongoing"},"dates":[1703548800000,1700006400000],"filterName":"Filtro teste","gruposTrabalho":[{"chave":3,"valor":"Corporativo"},{"chave":8,"valor":"Le Biscuit"}],"index":3,"quadroKanban":{"chave":2,"valor":"EMPRESARIAL"},"responsaveis":[{"chave":4657,"valor":"CÉSAR BRAGA LINS BAMBERG RODRIGUEZ"},{"chave":124,"valor":"RUY AMARAL ANDRADE"},{"chave":6314,"valor":"YASMIN PINHO"}],"situacoes":[{"codigoTarefaTipo":6,"nomeTipoTarefa":"A cumprir"}],"tipos":[{"chave":12,"valor":"Agravo de Intrumento"},{"chave":37,"valor":"Petição simples"}]}';

export { filterMock, orderedFilterObj, unorderedFilterObj, expectedJson };
