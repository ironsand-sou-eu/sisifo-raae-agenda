import {
  FetchedTarefaDetails,
  SimpleDocument,
  FetchedTarefa,
  WritingTarefaDetails,
  FetchedProcessoDetails,
} from "../../../global";
import { Filter } from "../providers/FiltersProvider";
import { NotificationsContext, useNotifications } from "../providers/NotificationsProvider";
import { useMessageGenerator } from "../useMessageGenerator";
import useProjurisConnector from "./useProjurisConnector";

export type TarefaUpdateActions = "concluir" | "cancelar" | "salvar";

export type TarefaUpdateParams =
  | {
      type: "salvar";
      name: string | undefined;
      reloadFunction?: () => void;
      tarefa?: WritingTarefaDetails;
    }
  | {
      type: Exclude<TarefaUpdateActions, "salvar">;
      name: string | undefined;
      codigoTarefaEvento: number | undefined;
      kanbanFindingCode: KanbanFindingCode;
      reloadFunction?: () => void;
    };

type KanbanFindingCode = { codigoQuadroKanban: number } | { codigoProcesso: number };

export const tarefaActions = {
  concluir: {
    code: 2,
    name: "Concluída",
  },
  cancelar: {
    code: 5,
    name: "Cancelado",
  },
};

export default function useProjurisTarefasConnector() {
  const { addNotification, removeNotification } = useNotifications() as NotificationsContext;
  const { generateNotification, generateStringMsg } = useMessageGenerator();
  const { endpoints, makeProjurisRequest, extractOptionsArray, loadSimpleOptions } = useProjurisConnector();

  async function fetchTarefaDetails(codigoTarefaEvento: number, codigoProcesso: number): Promise<FetchedTarefaDetails> {
    const endpoint = endpoints.tarefaDetails(codigoTarefaEvento, codigoProcesso);
    const response = await makeProjurisRequest({ endpoint, method: "GET" });
    return await response.json();
  }

  async function fetchProcessoDetails(codigoProcesso: number): Promise<FetchedProcessoDetails> {
    const endpoint = endpoints.consultarProcesso(codigoProcesso);
    const response = await makeProjurisRequest({ endpoint, method: "GET" });
    return await response.json();
  }

  async function fetchTarefasFromFilter(filter: Filter, pageNumber: number): Promise<FetchedTarefa[]> {
    const endpoint = endpoints.consultarTarefaComPaginacao(pageNumber, 20, "ASC");
    const body = createQueryBody(filter);
    const response = await makeProjurisRequest({ endpoint, method: "POST", body });
    return (await extractOptionsArray(response)) ?? [];
  }

  function createQueryBody(filter: Filter): string {
    const filterBody: any = {
      flagVinculoPrincipal: true,
      tarefaTipoData: "DATA_PREVISTA_CONCLUSAO",
      codigoQuadroKanban: filter.quadroKanban ? filter.quadroKanban.chave : "",
      usuariosResponsaveis: filter.responsaveis ? filter.responsaveis : [],
      gruposResponsaveis: filter.gruposTrabalho ? filter.gruposTrabalho : [],
      codigoSituacao: filter.situacao ? filter.situacao.chave : "",
      codigosTarefaTipo: filter.tipos ? filter.tipos.map(tipo => tipo.codigoTarefaTipo) : [],
    };

    const dateArray = [];
    if (filter.nextXDays) {
      dateArray[0] = new Date();
      dateArray[1] = new Date().getTime() + filter.nextXDays * 24 * 60 * 60 * 1000;
    } else if (filter.dates) {
      dateArray[0] = filter.dates[0];
      dateArray[1] = filter.dates[1];
    }
    dateArray.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const [dataTarefaInicio, dataTarefaFim] = dateArray;
    if (dataTarefaInicio) filterBody.dataTarefaInicio = dataTarefaInicio;
    if (dataTarefaFim) filterBody.dataTarefaFim = dataTarefaFim;
    return JSON.stringify(filterBody);
  }

  async function dispatchBackendTarefaUpdate(params: TarefaUpdateParams | TarefaUpdateParams[]): Promise<void> {
    const parameters = Array.isArray(params) ? params : [params];
    if (!confirm(generateStringMsg.confirmUpdate(parameters[0].type, parameters.length > 1))) return;
    parameters.forEach(async param => {
      setTimeout(() => {
        singleBackendTarefaUpdate(param);
      }, 200);
    });
  }

  async function singleBackendTarefaUpdate(params: TarefaUpdateParams): Promise<void> {
    const { type, name, reloadFunction } = params;
    const tarefa = type === "salvar" ? params.tarefa : undefined;
    const { codigoTarefaEvento, kanbanFindingCode } =
      type !== "salvar" ? params : { codigoTarefaEvento: undefined, kanbanFindingCode: undefined };
    if (name === undefined) return;
    if ((type === "salvar" && !tarefa) || (type !== "salvar" && !codigoTarefaEvento)) return;
    const progressMsg = generateNotification.progress(type, "tarefa");
    addNotification(progressMsg);

    const bodyObj =
      type === "salvar"
        ? tarefa ?? null
        : await fetchPayloadsForUpdatingKanban(type, codigoTarefaEvento!, kanbanFindingCode!);
    const body = bodyObj ? JSON.stringify(bodyObj) : "";
    const { mainResponse, kanbanResponse } = await makeRequestsForUpdatingTarefa(type, body, codigoTarefaEvento);
    removeNotification(progressMsg);
    if (reloadFunction) reloadFunction();
    const msg = await generateNotification.response({
      action: type,
      entityName: name,
      entityType: "tarefa",
      mainResponse,
      kanbanResponse,
    });
    addNotification(msg);
  }

  async function fetchPayloadsForUpdatingKanban(
    type: keyof typeof tarefaActions,
    codigoTarefaEvento: number,
    param: KanbanFindingCode
  ) {
    if ("codigoQuadroKanban" in param && !param.codigoQuadroKanban) return null;
    const quadroKanban =
      "codigoQuadroKanban" in param
        ? param.codigoQuadroKanban
        : await fetchCodigoQuadroKanbanForTarefa(codigoTarefaEvento, param.codigoProcesso);
    if (!quadroKanban) return null;
    const colunasKanban: SimpleDocument[] = await loadSimpleOptions(endpoints.colunasKanban(quadroKanban), {}, false);
    const concludedObj = colunasKanban.find(
      coluna => coluna.valor.toLowerCase() === tarefaActions[type].name.toLowerCase()
    );
    const concludedCode = concludedObj?.chave;
    if (!concludedCode) throw new Error(generateStringMsg.situacaoCodeNotFound(tarefaActions[type].name));
    return {
      codigoColuna: concludedCode,
      codigoQuadro: quadroKanban,
      atualizarSituacaoTarefa: false,
      codigoTarefaAnterior: 0,
      codigoTarefaPosterior: 0,
    };
  }

  async function fetchCodigoQuadroKanbanForTarefa(
    codigoTarefaEvento: number,
    codigoProcesso: number
  ): Promise<number | null> {
    const tarefaDetails = await fetchTarefaDetails(codigoTarefaEvento, codigoProcesso);
    return tarefaDetails.tarefaEventoWs.quadroKanban?.chave ?? null;
  }

  async function makeRequestsForUpdatingTarefa(type: TarefaUpdateActions, body: string, codigoTarefaEvento?: number) {
    const endpointAction = endpoints.updateTarefa(type, codigoTarefaEvento);
    if (!endpointAction) {
      const errorMsg = generateNotification.errorUpdateEndpointNotFound(type, "makeRequestsForConcludingTarefa");
      addNotification(errorMsg);
      throw new Error(errorMsg.text);
    }
    const mainResponse = await makeProjurisRequest({
      method: "PUT",
      endpoint: endpointAction,
      body: type === "salvar" ? body : "",
    });
    const kanbanResponse = await makeKanbanRequest(type, body, codigoTarefaEvento);
    return { mainResponse, kanbanResponse };
  }

  async function makeKanbanRequest(type: TarefaUpdateActions, body: string, codigoTarefaEvento?: number) {
    if (type === "salvar" || !body) return null;

    const endpointKanban = endpoints.alterarColunaKanbanTarefa(codigoTarefaEvento);
    if (!endpointKanban) {
      const errorMsg = generateNotification.errorKanbanEndpointNotFound("makeKanbanRequest");
      addNotification(errorMsg);
      throw new Error(errorMsg.text);
    }
    return await makeProjurisRequest({ method: "PUT", endpoint: endpointKanban, body });
  }

  return {
    fetchTarefaDetails,
    fetchProcessoDetails,
    fetchTarefasFromFilter,
    dispatchBackendTarefaUpdate,
  };
}
