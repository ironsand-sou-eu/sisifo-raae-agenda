import { WritingAndamento, WritingNewTarefa, WritingTimesheet } from "../../../global";
import { DisplayingAndamento, DisplayingNewTarefa, DisplayingTimesheet } from "../../../global.zod";

export default function useCreateEntitiesAdapter() {
  function adaptDisplayingAndamentoToWritingType(
    displayingAndamento: DisplayingAndamento,
    codigoProcesso: number
  ): WritingAndamento {
    const { dataHoraAndamento, responsaveis, tipoAndamento, descricaoAndamento } = displayingAndamento;
    const writingAndamento: WritingAndamento = {
      modulos: [
        {
          modulo: "PROCESSO",
          codigoRegistroVinculo: codigoProcesso,
          vinculoPrincipal: true,
        },
      ],
      descricaoAndamento: descricaoAndamento ?? "",
      dataAndamento: dataHoraAndamento.toISOString(),
      horaAndamento: dataHoraAndamento.toISOString(),
      codigoTipoAndamento: tipoAndamento.chave,
      responsaveis,
      privado: true,
    };
    return writingAndamento;
  }

  function adaptDisplayingNewTarefaToWritingType(
    displayingNewTarefa: DisplayingNewTarefa,
    codigoProcesso: number
  ): WritingNewTarefa {
    const {
      colunaKanban,
      dataConclusaoPrevista,
      dataLimite,
      gruposResponsaveis,
      marcadorWs,
      quadroKanban,
      tarefaEventoSituacaoWs,
      tipoTarefa,
      usuariosResponsaveis,
      descricaoTarefa,
      local,
      titulo,
    } = displayingNewTarefa;
    const writingNewTarefa: WritingNewTarefa = {
      tarefaEventoWs: {
        descricaoTarefa: descricaoTarefa ?? "",
        dataBase: new Date().setHours(0, 0, 0, 0),
        dataConclusaoPrevista: dataConclusaoPrevista.getTime(),
        dataLimite: dataLimite.getTime(),
        usuariosResponsaveis,
        gruposResponsaveis,
        tipoTarefa,
        marcadorWs,
        tarefaEventoSituacaoWs: {
          codigoTarefaEventoSituacao: tarefaEventoSituacaoWs.chave,
          situacao: tarefaEventoSituacaoWs.valor,
        },
        privado: true,
        titulo: titulo ?? "",
        local: local ?? "",
        kanban: true,
        quadroKanban,
        colunaKanban: { chave: colunaKanban.chave, valor: colunaKanban.valor },
        modulos: [{ modulo: "PROCESSO", codigoRegistroVinculo: codigoProcesso, vinculoPrincipal: true }],
      },
      compromisso: false,
      possuiRecorrencia: false,
      tarefaCompromissoEventoWs: null,
      modulos: [{ modulo: "PROCESSO", codigoRegistroVinculo: codigoProcesso, vinculoPrincipal: true }],
    };
    return writingNewTarefa;
  }

  function adaptDisplayingTimesheetToWritingType(displayingTimesheet: DisplayingTimesheet): WritingTimesheet {
    const { dataHoraApontamento, faturar, qtdHoras, responsavel, tipoLancamento, descricaoApontamento } =
      displayingTimesheet;
    const writingTimesheet: WritingTimesheet = {
      apontamentoHoraTipoWs: {
        codigoTipoApontamentoHora: tipoLancamento.chave,
      },
      descricaoApontamentoHoras: descricaoApontamento ?? "",
      privado: true,
      faturarApontamentoHoras: faturar,
      responsavelApontamentoHoras: responsavel,
      horaApontamento: [
        {
          codigoHoraApontamento: null,
          dataApontamento: dataHoraApontamento.toISOString(),
          horasApontamento: qtdHoras.trim(),
          descricaoApontamento: descricaoApontamento ?? "",
        },
      ],
    };
    return writingTimesheet;
  }

  return {
    adaptDisplayingAndamentoToWritingType,
    adaptDisplayingNewTarefaToWritingType,
    adaptDisplayingTimesheetToWritingType,
  };
}
