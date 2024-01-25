import { FetchedTarefaDetails } from "../global";

const tarefaDetailsMock: FetchedTarefaDetails = {
  modulos: [
    {
      modulo: "PROCESSO",
      codigoRegistroVinculo: 17664534,
      vinculoPrincipal: true,
    },
  ],
  codigoTarefa: 17766781,
  tarefaEventoWs: {
    codigoTarefaEvento: 18486234,
    codigoUsuarioCriador: 89323,
    descricaoTarefa: "Minuta -  Petição Inicial - Prazo interno para ajuizamento da ação",
    identificador: "TAR.0017231",
    dataConclusao: null,
    dataConclusaoPrevista: 1698116400000,
    horaConclusao: 1701812640217,
    horaLimite: 1701816240218,
    dataLimite: 1698894000000,
    dataBase: 1697684400000,
    usuariosResponsaveis: [
      {
        chave: 89323,
        valor: "CÉSAR BRAGA LINS BAMBERG RODRIGUEZ",
      },
      {
        chave: 45858,
        valor: "RUY AMARAL ANDRADE",
      },
    ],
    gruposResponsaveis: [
      {
        chave: 42284,
        valor: "Empresarial",
      },
      {
        chave: 42282,
        valor: "Cível - Consumidor",
      },
    ],
    codigoTarefa: 17766781,
    tipoTarefa: {
      chave: 1362420,
      valor: "Protocolo",
    },
    marcadorWs: [
      {
        codigoMarcador: 73056,
        nomeMarcador: "acidente",
      },
      {
        codigoMarcador: 111251,
        nomeMarcador: "ACP",
      },
    ],
    tarefaEventoSituacaoWs: {
      codigoTarefaEventoSituacao: 1,
      situacao: "Pendente",
      situacaoConcluida: false,
    },
    titulo: "IGNORAR - Teste do Sísifo",
    kanban: true,
    quadroKanban: {
      chave: 16738,
      valor: "EMPRESARIAL",
    },
    colunaKanban: {
      chave: 111316,
      valor: "Pendente",
    },
  },
};
export default tarefaDetailsMock;
