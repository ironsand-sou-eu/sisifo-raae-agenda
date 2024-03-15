import {
  DisplayingTarefa,
  DisplayingTarefaDetails,
  FetchedTarefaDetails,
  FetchedTarefa,
  WritingTarefaDetails,
} from "../../../global";
import { projurisSiteBase } from "../../../hardcoded";
import useProjurisConnector from "../connectors/useProjurisConnector";
import { TarefaUpdateActions, TarefaUpdateParams } from "../connectors/useProjurisTarefasConnector";

export default function useTarefasAdapter() {
  const { endpoints } = useProjurisConnector();

  function adaptTarefasListToDisplayingType(tarefasList: FetchedTarefa[] = []): DisplayingTarefa[] {
    return tarefasList.map(parseSmallTarefaCardProps);
  }

  function parseSmallTarefaCardProps(tarefaInfo: FetchedTarefa): DisplayingTarefa {
    const {
      checked,
      codigoTarefaEvento,
      corTarefaTipo: tarefaColor,
      dataConclusaoPrevista,
      descricao,
      flagSituacaoConcluida,
      gruposResponsaveis,
      identificadorModulo,
      modulo: { chave: codigoProcesso },
      nomeTarefaTipo,
      numeroProcesso,
      parteAtiva,
      partePassiva,
      situacao,
      usuarioResponsaveis,
    } = tarefaInfo;
    const displayingParteAtiva = parteAtiva ?? "Não disponível";
    const displayingPartePassiva = partePassiva ?? "Não disponível";
    const displayingNumeroProcesso = numeroProcesso ?? identificadorModulo ?? "Sem número";
    const displayingGruposResponsaveis = gruposResponsaveis ?? "Sem núcleo";
    const prazo = dataConclusaoPrevista ? new Date(dataConclusaoPrevista) : undefined;

    return {
      checked,
      codigoTarefaEvento,
      tarefaColor: tarefaColor ?? "#fff9",
      descricao,
      gruposResponsaveis: displayingGruposResponsaveis,
      codigoProcesso,
      nomeTarefaTipo,
      numeroProcesso: displayingNumeroProcesso,
      parteAtiva: displayingParteAtiva,
      partePassiva: displayingPartePassiva,
      situacao: situacao ?? "Não encontrada",
      usuarioResponsaveis,
      prazo: prazo ? prazo.toLocaleDateString("pt-BR") : "Não encontrado",
      processoUrl: codigoProcesso ? projurisSiteBase + endpoints.processoVisaoCompleta(codigoProcesso) : "",
      prazoColorCssVariable: getPrazoColorCssVariable(prazo, flagSituacaoConcluida),
    };
  }

  function adaptTarefasListToUpdatingParams(
    tarefas: DisplayingTarefa | DisplayingTarefa[],
    type: TarefaUpdateActions,
    reloadFunction?: () => void
  ): TarefaUpdateParams[] {
    const list = Array.isArray(tarefas) ? tarefas : [tarefas];
    return list.map(({ nomeTarefaTipo, codigoTarefaEvento, codigoProcesso }) => {
      return {
        type,
        name: nomeTarefaTipo,
        codigoTarefaEvento: codigoTarefaEvento,
        kanbanFindingCode: { codigoProcesso: codigoProcesso },
        reloadFunction,
      };
    });
  }

  function adaptTarefaDetailsToDisplayingType(
    tarefaDetails?: FetchedTarefaDetails,
    tarefaColor?: string
  ): DisplayingTarefaDetails {
    const {
      tarefaEventoWs: {
        titulo,
        tipoTarefa,
        tarefaEventoSituacaoWs: { situacaoConcluida },
        dataConclusao,
        dataConclusaoPrevista,
        dataLimite,
        descricaoTarefa,
        local,
        usuariosResponsaveis,
        gruposResponsaveis,
        marcadorWs,
        colunaKanban,
        quadroKanban,
      },
    } = tarefaDetails || { tarefaEventoWs: { tarefaEventoSituacaoWs: {} } };
    const codigoProcessoProjuris = tarefaDetails?.modulos[0].codigoRegistroVinculo;
    const prazoAdm = dataConclusaoPrevista ? new Date(dataConclusaoPrevista) : undefined;
    let displayTitulo = "";
    if (tipoTarefa?.valor) displayTitulo = tipoTarefa.valor;
    if (titulo && titulo !== "") displayTitulo = titulo;

    return {
      displayTitulo,
      titulo: titulo ?? "",
      tarefaColor: tarefaColor ?? "#fff9",
      codigoProcessoProjuris,
      processoUrl: codigoProcessoProjuris
        ? projurisSiteBase + endpoints.processoVisaoCompleta(codigoProcessoProjuris)
        : "",
      descricaoTarefa,
      usuariosResponsaveis: usuariosResponsaveis ?? [],
      gruposResponsaveis: gruposResponsaveis ?? [],
      local: local ?? "",
      marcadorWs: marcadorWs ?? [],
      colunaKanban,
      quadroKanban,
      dataConclusaoPrevista: dataConclusaoPrevista ? new Date(dataConclusaoPrevista) : null,
      dataLimite: dataLimite ? new Date(dataLimite) : null,
      dataConclusao: dataConclusao ? new Date(dataConclusao) : null,
      prazoColorCssVariable: getPrazoColorCssVariable(prazoAdm, situacaoConcluida),
    };
  }

  function getPrazoColorCssVariable(prazo?: Date, flagSituacaoConcluida: boolean = false): string {
    if (flagSituacaoConcluida) return "--fill-color-blue";
    if (!prazo) return "--fill-color-red";
    if (new Date().toLocaleDateString("pt-BR") === prazo.toLocaleDateString("pt-BR")) return "--fill-color-red";
    if (new Date().getTime() >= prazo.getTime()) return "--fill-color-black";
    const daysToPutInWarning = 2;
    const daysToPutInWarningInMs = daysToPutInWarning * 24 * 60 * 60 * 1000;
    if (new Date().getTime() >= prazo.getTime() - daysToPutInWarningInMs) return "--fill-color-orange";
    return "--fill-color-green";
  }

  function adaptTarefaDetailsToWritingType(tarefa: FetchedTarefaDetails): WritingTarefaDetails {
    const {
      tarefaEventoWs: {
        codigoTarefa,
        codigoTarefaEvento,
        descricaoTarefa,
        dataConclusao,
        dataConclusaoPrevista,
        dataLimite,
        dataBase,
        local,
        usuariosResponsaveis,
        gruposResponsaveis,
        tipoTarefa,
        marcadorWs,
        tarefaEventoSituacaoWs: { codigoTarefaEventoSituacao, situacao },
        titulo,
        kanban,
        quadroKanban,
        colunaKanban,
      },
    } = tarefa;

    return {
      codigoTarefaEvento,
      descricaoTarefa,
      dataConclusao,
      dataConclusaoPrevista,
      dataLimite,
      dataBase,
      usuariosResponsaveis,
      gruposResponsaveis,
      local,
      codigoTarefa,
      tipoTarefa,
      marcadorWs,
      tarefaEventoSituacaoWs: {
        codigoTarefaEventoSituacao: codigoTarefaEventoSituacao ?? -1,
        situacao: situacao ?? "",
      },
      titulo,
      kanban,
      quadroKanban,
      colunaKanban,
    };
  }

  function adaptTarefaDetailsToUpdatingParams(
    tarefaDetails: DisplayingTarefaDetails,
    codigoTarefaEvento: number,
    type: TarefaUpdateActions,
    reloadFunction?: () => void
  ): TarefaUpdateParams {
    return {
      type,
      name: tarefaDetails.displayTitulo,
      codigoTarefaEvento,
      kanbanFindingCode: { codigoQuadroKanban: tarefaDetails.quadroKanban?.chave },
      reloadFunction,
    };
  }

  return {
    adaptTarefasListToDisplayingType,
    adaptTarefaDetailsToDisplayingType,
    adaptTarefaDetailsToWritingType,
    adaptTarefasListToUpdatingParams,
    adaptTarefaDetailsToUpdatingParams,
  };
}
