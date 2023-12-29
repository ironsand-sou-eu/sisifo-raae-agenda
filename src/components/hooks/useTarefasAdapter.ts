import { Tarefa } from "../../global";
import { projurisApiBase } from "../../hardcoded";
import useProjurisConnector from "./useProjurisConnector";

export default function useFetchedTarefasAdapter() {
  function adaptFetchedTarefasList(tarefasList: Tarefa[] = []) {
    return tarefasList.map(parseSmallTarefaCardProps);
  }

  function parseSmallTarefaCardProps(tarefaInfo: Tarefa) {
    const { endpoints } = useProjurisConnector();
    const {
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

    const prazo = new Date(dataConclusaoPrevista);
    const prazoString = prazo.toLocaleDateString("pt-BR");
    const processoUrl = projurisApiBase + endpoints.processoVisaoCompleta + codigoProcesso;
    const prazoStyle = getPrazoStyle(prazo, flagSituacaoConcluida);
    return {
      codigoTarefaEvento,
      tarefaColor,
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
      prazoString,
      processoUrl,
      prazoStyle,
    };
  }

  function adaptFetchedTarefaDetails() {}

  function getPrazoStyle(prazo: Date, flagSituacaoConcluida: boolean): string {
    if (flagSituacaoConcluida) return "done";
    if (new Date().toLocaleDateString("pt-BR") === prazo.toLocaleDateString("pt-BR")) return "danger";
    if (new Date().getTime() >= prazo.getTime()) return "lost";
    const daysInMs = 2 * 24 * 60 * 60 * 1000;
    if (new Date().getTime() >= prazo.getTime() - daysInMs) return "warning";
    return "normal";
  }

  return { adaptFetchedTarefasList, adaptFetchedTarefaDetails };
}
