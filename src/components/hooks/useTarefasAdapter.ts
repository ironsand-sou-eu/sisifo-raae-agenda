import { Tarefa } from "../../global";
import { projurisApiBase } from "../../hardcoded";
import useProjurisConnector, { TarefaDetails } from "./useProjurisConnector";

export default function useFetchedTarefasAdapter() {
  const { endpoints } = useProjurisConnector();

  function adaptFetchedTarefasList(tarefasList: Tarefa[] = []) {
    return tarefasList.map(parseSmallTarefaCardProps);
  }

  function parseSmallTarefaCardProps(tarefaInfo: Tarefa) {
    const {
      codigoTarefaEvento,
      corTarefaTipo: tarefaColor,
      dataConclusaoPrevista,
      descricao,
      flagSituacaoConcluida,
      gruposResponsaveis,
      modulo: { chave: codigoProcessoProjuris },
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
      codigoTarefaEvento,
      tarefaColor: tarefaColor ?? "#fff9",
      dataConclusaoPrevista,
      descricao,
      gruposResponsaveis: displayingGruposResponsaveis,
      codigoProcessoProjuris,
      nomeTarefaTipo,
      numeroProcesso: displayingNumeroProcesso,
      parteAtiva: displayingParteAtiva,
      partePassiva: displayingPartePassiva,
      situacao,
      usuarioResponsaveis,
      prazoString: prazo ? prazo.toLocaleDateString("pt-BR") : "Não encontrado",
      processoUrl: codigoProcessoProjuris ? projurisApiBase + endpoints.processoVisaoCompleta + codigoProcessoProjuris : "",
      prazoStyle: getPrazoStyle(prazo, flagSituacaoConcluida),
    };
  }

  function adaptFetchedTarefaDetails(tarefaDetails?: TarefaDetails, tarefaColor?: string) {
    const {
      tarefaEventoWs: {
        titulo,
        tipoTarefa,
        tarefaEventoSituacaoWs: { situacao, situacaoConcluida },
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
      situacao: situacao ?? "Não encontrada",
      tarefaColor: tarefaColor ?? "#fff9",
      codigoProcessoProjuris,
      processoUrl: codigoProcessoProjuris ? projurisApiBase + endpoints.processoVisaoCompleta + codigoProcessoProjuris : "",
      descricaoTarefa,
      usuariosResponsaveis,
      gruposResponsaveis,
      marcadorWs,
      colunaKanban,
      quadroKanban,
      prazoAdmString: prazoAdm ? prazoAdm.toLocaleDateString("pt-BR") : "Não encontrado",
      prazoFatalString: dataLimite ? new Date(dataLimite).toLocaleDateString("pt-BR") : "Não encontrado",
      dataConclusaoString: dataConclusao ? ` em ${new Date(dataConclusao).toLocaleDateString("pt-BR")}` : "",
      prazoStyle: getPrazoStyle(prazoAdm, situacaoConcluida),
    };
  }

  function getPrazoStyle(prazo?: Date, flagSituacaoConcluida: boolean = false): string {
    if (flagSituacaoConcluida) return "done";
    if (!prazo) return "danger";
    if (new Date().toLocaleDateString("pt-BR") === prazo.toLocaleDateString("pt-BR")) return "danger";
    if (new Date().getTime() >= prazo.getTime()) return "lost";
    const daysToPutInWarning = 2;
    const daysToPutInWarningInMs = daysToPutInWarning * 24 * 60 * 60 * 1000;
    if (new Date().getTime() >= prazo.getTime() - daysToPutInWarningInMs) return "warning";
    return "normal";
  }

  return { adaptFetchedTarefasList, adaptFetchedTarefaDetails };
}
