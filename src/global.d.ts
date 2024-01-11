import { SimpleDocument } from "./components/hooks/useProjurisConnector";

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type SimpleDocument = {
  chave: number;
  valor: string;
};

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

export type Tarefa = {
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

export type ReceivedTarefaDetails = {
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
      codigoTarefaEventoSituacao: number;
      situacao: string;
      situacaoConcluida: boolean;
    };
    titulo: string;
    kanban: boolean;
    quadroKanban: SimpleDocument;
    colunaKanban: SimpleDocument;
  };
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

export type DisplayingTarefaDetails = {
  codigoProcessoProjuris?: number;
  colunaKanban: SimpleDocument;
  descricaoTarefa?: string;
  dataConclusaoString: string;
  displayTitulo: string;
  gruposResponsaveis: SimpleDocument[];
  marcadorWs: Marcador[];
  prazoAdmString: string;
  prazoFatalString: string;
  prazoStyle: string;
  processoUrl: string;
  quadroKanban: SimpleDocument;
  situacao: string;
  tarefaColor: string;
  usuariosResponsaveis: SimpleDocument[];
};
