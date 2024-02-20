import { SimpleDocument } from "./components/hooks/connectors/useProjurisConnector";
export { DisplayingAndamento, DisplayingTimesheet, SimpleDocument, Marcador } from "./global.zod";

export type Prettify<T> = { [K in keyof T]: T[K] } & {};
export type PartialOrNullable<T> = { [P in keyof T]?: T[P] | undefined | null };

export type Marcador = {
  codigoMarcador: number;
  nomeMarcador: string;
};

export type SituacaoTarefa = {
  codigoTarefaTipo: number;
  nomeTipoTarefa: string;
};

type Modulo = {
  modulo: string;
  codigoRegistroVinculo: number;
  vinculoPrincipal: boolean;
};

export type Notification = {
  text: string;
  type: "success" | "error" | "progress";
};

export type DisplayingTarefa = {
  checked?: boolean;
  codigoProcesso: number;
  codigoTarefaEvento: number;
  descricao: string;
  gruposResponsaveis: string;
  nomeTarefaTipo: string;
  numeroProcesso: string;
  parteAtiva: string;
  partePassiva: string;
  prazo: string;
  prazoColorCssVariable: string;
  processoUrl: string;
  situacao: string;
  tarefaColor: string;
  usuarioResponsaveis: string;
};

export type DisplayingTarefaDetails = {
  codigoProcessoProjuris?: number;
  colunaKanban: SimpleDocument;
  descricaoTarefa?: string;
  dataConclusao: Date | null;
  dataConclusaoPrevista: Date | null;
  dataLimite: Date | null;
  displayTitulo: string;
  gruposResponsaveis: SimpleDocument[];
  marcadorWs: Marcador[];
  prazoColorCssVariable: string;
  processoUrl: string;
  quadroKanban: SimpleDocument;
  tarefaColor: string;
  usuariosResponsaveis: SimpleDocument[];
};

export type FetchedTarefa = {
  checked?: boolean;
  codigoTarefa: number;
  codigoTarefaEvento: number;
  codigoTarefaTipo: number;
  corTarefaTipo: string;
  descricao: string;
  identificador: string;
  modulo: SimpleDocument;
  chaveModulo: string;
  nomeTarefaTipo: string;
  usuarioResponsaveis: string;
  gruposResponsaveis: string;
  dataLimite: number;
  dataConclusao: number;
  dataConclusaoPrevista: number;
  horaConclusao: number;
  horaLimite: number;
  codigoSituacao: number;
  situacao: string;
  flagSituacaoConcluida: boolean;
  titulo: string;
  flagTarefaCompromisso: string;
  dataInicioCompromisso: number;
  horaInicioCompromisso: number;
  dataFimCompromisso: number;
  numeroComentarios: number;
  flagCompromissoConcluido: boolean;
  privado: boolean;
  numeroProcesso: string;
  parteAtiva: string;
  partePassiva: string;
  identificadorModulo: string;
  tarefaPrivada: boolean;
  acessoPrivado: boolean;
  diaTodo: boolean;
  dataInclusao: number;
};

export type FetchedTarefaDetails = {
  modulos: Modulo[];
  codigoTarefa: number;
  tarefaEventoWs: {
    codigoTarefaEvento: number;
    codigoUsuarioCriador: number;
    descricaoTarefa: string;
    identificador: string;
    dataConclusao: number | null;
    dataConclusaoPrevista: number | null;
    horaConclusao: number;
    horaLimite: number;
    dataLimite: number | null;
    dataBase: number | null;
    usuariosResponsaveis: SimpleDocument[];
    gruposResponsaveis: SimpleDocument[];
    codigoTarefa: number;
    tipoTarefa: SimpleDocument;
    marcadorWs: Marcador[];
    tarefaEventoSituacaoWs: {
      codigoTarefaEventoSituacao?: number;
      situacao?: string;
      situacaoConcluida?: boolean;
    };
    titulo: string;
    kanban: boolean;
    quadroKanban: SimpleDocument;
    colunaKanban: SimpleDocument;
  };
};

export type WritingAndamento = {
  modulos: Modulo[];
  descricaoAndamento?: string;
  dataAndamento: string;
  horaAndamento: string;
  codigoTipoAndamento: number;
  responsaveis: SimpleDocument[];
  privado: boolean;
};

export type WritingTarefaDetails = {
  codigoTarefaEvento: number;
  descricaoTarefa: string;
  dataConclusao: number | null;
  dataConclusaoPrevista: number | null;
  dataLimite: number | null;
  dataBase: number | null;
  usuariosResponsaveis: SimpleDocument[];
  gruposResponsaveis: SimpleDocument[];
  codigoTarefa: number;
  tipoTarefa: SimpleDocument;
  marcadorWs: Marcador[];
  tarefaEventoSituacaoWs: {
    codigoTarefaEventoSituacao: number;
    situacao: string;
  };
  titulo: string;
  kanban: boolean;
  quadroKanban: SimpleDocument;
  colunaKanban: SimpleDocument;
};

export type WritingNewTarefa = {
  tarefaEventoWs: {
    descricaoTarefa: string;
    dataBase: number | null;
    dataConclusaoPrevista: number | null;
    dataLimite: number | null;
    usuariosResponsaveis: SimpleDocument[];
    gruposResponsaveis: SimpleDocument[];
    tipoTarefa: SimpleDocument;
    marcadorWs: Marcador[];
    tarefaEventoSituacaoWs: {
      codigoTarefaEventoSituacao: number;
      situacao: string;
    };
    privado: true;
    titulo: string;
    local: string;
    kanban: boolean;
    quadroKanban: SimpleDocument;
    colunaKanban: SimpleDocument;
    modulos: Modulo[];
  };
  compromisso: boolean;
  possuiRecorrencia: boolean;
  tarefaCompromissoEventoWs: null;
  modulos: Modulo[];
};

export type WritingTimesheet = {
  apontamentoHoraTipoWs: {
    codigoTipoApontamentoHora: number;
  };
  descricaoApontamentoHoras: string;
  privado: boolean;
  faturarApontamentoHoras: boolean;
  responsavelApontamentoHoras: SimpleDocument;
  horaApontamento: {
    codigoHoraApontamento: null;
    dataApontamento: string;
    horasApontamento: string;
    descricaoApontamento: string;
  }[];
};
