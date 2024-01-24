import { DisplayingTarefaDetails, ReceivedTarefaDetails, Tarefa, WritingTarefaDetails } from "../../global";
import { projurisApiBase } from "../../hardcoded";
import useProjurisConnector from "./useProjurisConnector";

export default function useFetchedTarefasAdapter() {
  const { endpoints } = useProjurisConnector();

  function adaptFetchedTarefasListToDisplayingType(tarefasList: Tarefa[] = []) {
    return tarefasList.map(parseSmallTarefaCardProps);
  }

  function parseSmallTarefaCardProps(tarefaInfo: Tarefa) {
    const {
      checked,
      codigoTarefaEvento,
      corTarefaTipo: tarefaColor,
      dataConclusaoPrevista,
      descricao,
      flagSituacaoConcluida,
      gruposResponsaveis,
      modulo: { chave: codigoProcesso },
      nomeTarefaTipo,
      numeroProcesso,
      parteAtiva,
      partePassiva,
      situacao,
      usuarioResponsaveis,
    } = tarefaInfo;
    const displayingParteAtiva = parteAtiva ? parteAtiva : "Não disponível";
    const displayingPartePassiva = partePassiva ? partePassiva : "Não disponível";
    const displayingNumeroProcesso = numeroProcesso ? numeroProcesso : "Sem número";
    const displayingGruposResponsaveis = gruposResponsaveis ? gruposResponsaveis : "Sem núcleo";

    const prazo = dataConclusaoPrevista ? new Date(dataConclusaoPrevista) : undefined;
    return {
      checked,
      codigoTarefaEvento,
      tarefaColor: tarefaColor ?? "#fff9",
      dataConclusaoPrevista,
      descricao,
      gruposResponsaveis: displayingGruposResponsaveis,
      codigoProcesso,
      nomeTarefaTipo,
      numeroProcesso: displayingNumeroProcesso,
      parteAtiva: displayingParteAtiva,
      partePassiva: displayingPartePassiva,
      situacao,
      usuarioResponsaveis,
      prazoString: prazo ? prazo.toLocaleDateString("pt-BR") : "Não encontrado",
      processoUrl: codigoProcesso ? projurisApiBase + endpoints.processoVisaoCompleta + codigoProcesso : "",
      prazoColorCssVariable: getPrazoColorCssVariable(prazo, flagSituacaoConcluida),
    };
  }

  function adaptFetchedTarefaDetailsToDisplayingType(tarefaDetails?: ReceivedTarefaDetails, tarefaColor?: string): DisplayingTarefaDetails {
    const {
      tarefaEventoWs: {
        titulo,
        tipoTarefa,
        tarefaEventoSituacaoWs: { situacaoConcluida },
        dataConclusao,
        dataConclusaoPrevista,
        dataLimite,
        descricaoTarefa,
        usuariosResponsaveis,
        gruposResponsaveis,
        marcadorWs,
        colunaKanban,
        quadroKanban,
      },
    } = tarefaDetails || { tarefaEventoWs: { tarefaEventoSituacaoWs: {} } };
    const codigoProcessoProjuris = tarefaDetails?.modulos[0].codigoRegistroVinculo;
    const prazoAdm = dataConclusaoPrevista ? new Date(dataConclusaoPrevista) : undefined;
    const displayTitulo = titulo ?? tipoTarefa?.valor ?? "";

    return {
      displayTitulo,
      tarefaColor: tarefaColor ?? "#fff9",
      codigoProcessoProjuris,
      processoUrl: codigoProcessoProjuris ? projurisApiBase + endpoints.processoVisaoCompleta + codigoProcessoProjuris : "",
      descricaoTarefa,
      usuariosResponsaveis: usuariosResponsaveis ?? [],
      gruposResponsaveis: gruposResponsaveis ?? [],
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

  function adaptTarefaDetailsToWritingType(tarefa: ReceivedTarefaDetails): WritingTarefaDetails {
    const {
      tarefaEventoWs: {
        codigoTarefa,
        codigoTarefaEvento,
        descricaoTarefa,
        dataConclusao,
        dataConclusaoPrevista,
        dataLimite,
        dataBase,
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
      codigoTarefa,
      tipoTarefa,
      marcadorWs,
      tarefaEventoSituacaoWs: {
        codigoTarefaEventoSituacao,
        situacao,
      },
      titulo,
      kanban,
      quadroKanban,
      colunaKanban,
    };
  }

  return { adaptFetchedTarefasListToDisplayingType, adaptFetchedTarefaDetailsToDisplayingType, adaptTarefaDetailsToWritingType };
}
