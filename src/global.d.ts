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

type FetchedTipoDeCampoDinamicoWs = {
  codigo: number;
  campoDinamicoTipo: "TEXTO_CURTO";
  nome: string;
  textoAjuda: string;
  visivel: boolean;
  obrigatorio: boolean;
  listaMultipla: null;
  aba: SimpleDocument;
};

type WritingCampoDinamicoWs = {
  codigoCampoDinamico: number;
  campoDinamicoTipo: "TEXTO_CURTO";
  nomeCampoDinamico: string;
  valorCampoTexto: string;
  codigoCampoDinamicoDado: null;
};

export type Notification = {
  text: string;
  type: "success" | "error" | "progress";
};

type PessoaAutoComplete = {
  codigoPessoa: number;
  codigoUsuario: number;
  nomePessoa: string;
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
  descricaoProcesso?: string;
  descricaoTarefa?: string;
  dataConclusao: Date | null;
  dataConclusaoPrevista: Date | null;
  dataLimite: Date | null;
  displayTitulo: string;
  gruposResponsaveis: SimpleDocument[];
  local: string;
  marcadorWs: Marcador[];
  prazoColorCssVariable: string;
  processoUrl: string;
  quadroKanban: SimpleDocument;
  tarefaColor: string;
  titulo: string;
  usuariosResponsaveis: SimpleDocument[];
};

export type Comentario = {
  codigoComentario: number;
  descricaoComentario: string;
  dataInclusao: number;
  pessoaConsultaAutoCompleteSimplesWs: PessoaAutoComplete;
  pessoaConsultaAutoCompleteDtoWs: {
    pessoaConsultaAutoCompleteSimplesWs: PessoaAutoComplete[];
  };
  dataModificado: number;
  codigoComentarioPai: number;
  comentarioWs: FetchedComentarios[];
};

export type FetchedComentarios = {
  totalRegistros: number;
  comentarioWs: Comentario[];
};

export type FetchedTarefa = {
  checked?: boolean;
  codigoTarefa: number;
  codigoTarefaEvento: number;
  codigoTarefaTipo: number;
  corTarefaTipo: string;
  descricao: string;
  identificador: string;
  identificadorModulo: string;
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
    codigoTarefa: number;
    codigoTarefaEvento: number;
    codigoUsuarioCriador: number;
    colunaKanban: SimpleDocument;
    dataBase: number | null;
    dataConclusao: number | null;
    dataConclusaoPrevista: number | null;
    dataLimite: number | null;
    descricaoTarefa: string;
    gruposResponsaveis: SimpleDocument[];
    horaConclusao: number;
    horaLimite: number;
    identificador: string;
    kanban: boolean;
    local: string;
    marcadorWs: Marcador[];
    quadroKanban: SimpleDocument;
    tarefaEventoSituacaoWs: {
      codigoTarefaEventoSituacao?: number;
      situacao?: string;
      situacaoConcluida?: boolean;
    };
    tipoTarefa: SimpleDocument;
    titulo: string;
    usuariosResponsaveis: SimpleDocument[];
  };
};

export type FetchedProcessoDetails = {
  codigoProcesso: number;
  identificador: string;
  responsaveis: SimpleDocument[];
  pastaCliente: string;
  descricao: string;
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

export type WritingComentario = {
  descricaoComentario: string;
  codigoComentarioPai: number;
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
  local?: string;
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
    marcadorWs?: Marcador[];
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
  campoDinamicoDadoWs: WritingCampoDinamicoWs[];
};
