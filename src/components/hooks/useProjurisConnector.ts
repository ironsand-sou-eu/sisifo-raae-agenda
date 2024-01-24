import envVars from "../../envVars";
import { ReceivedTarefaDetails, SimpleDocument, Tarefa, WritingTarefaDetails } from "../../global";
import { projurisApiBase, projurisLoginUri } from "../../hardcoded";
import { Operator, compareWithOperator } from "../../utils/utils";
import { Filter } from "./FiltersProvider";
import { useMessages } from "./MessagesProvider";
import { useMessageGenerator } from "./useMessageGenerator";

type ProjurisAccessToken = {
  projurisToken: string;
  projurisExpiration: number;
};

export type ProjurisOptionsFilter = {
  key: string;
  operator: Operator;
  val: string;
  flattenOptions: boolean;
};

type FetchOptions =
  | {
      method: "GET";
      endpoint: string;
    }
  | {
      method: "POST";
      endpoint: string;
      body: string;
    }
  | {
      method: "PUT";
      endpoint: string;
      body: string;
    };

export type TarefaUpdateActions = "concluir" | "cancelar" | "salvar";

type TarefaUpdateParams =
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
      findingCode: FindingCode;
      reloadFunction?: () => void;
    };

type FindingCode = { codigoQuadroKanban: number } | { codigoProcesso: number };

const tarefaActions = {
  concluir: {
    code: 2,
    name: "Concluída",
  },
  cancelar: {
    code: 5,
    name: "Cancelado",
  },
};

export default function useProjurisConnector() {
  const { addMessage, removeMessage } = useMessages();
  const { generateResponseMessage, generateProgressMessage } = useMessageGenerator();
  const endpoints = {
    processoVisaoCompleta: "casos/processo/visao-completa/",
    // assuntosProjuris: "/assunto/consulta/",
    // assuntosCnj: "/processo/assunto/",
    // tiposJustica: "/tipo?chave-tipo=processo-justica",
    // orgaoJudicial: "/tipo?chave-tipo=processo-orgao-judicial",
    // varas: "/processo/vara-numero/",
    // tiposVara: "/processo/vara-tipo/",
    // areas: "/processo/area/",
    // fases: "/processo/fase/",
    gruposTrabalho: "/grupo/",
    responsaveis: "/usuario/",
    marcadores: "/marcador/consulta/",
    // instanciasCnj: "/processo/instancia-cnj/",
    // camposDinamicos: "/campo-dinamico/3/13",
    // tiposParticipacao: "/processo/participacao-tipo/obter-arvore-completa/",
    tiposTarefa: "/tipo?chave-tipo=tarefa-tipo",
    situacoesTarefa: "/tipo?chave-tipo=tarefa-evento-situacao(chaveModulo:null)",
    tiposAndamento: "/andamento-tipo/consulta?",
    // pedidos: "/processo/pedido/consultar-por-nome?nome-pedido=",
    // bancos: "/financeiro/conta/consulta",
    // buscarPessoa: "/pessoa/consulta",
    // criarPessoa: "/pessoa",
    // vincularPessoaProcesso: "/processo/envolvido/",
    // buscarProcessoPorNumero: "/processo/consulta?filtro-geral=",
    // criarProcesso: "/processo-judicial",
    // criarAndamento: "/andamento",
    // criarPedido: "/processo/pedido/",
    consultarTarefaComPaginacao: (registersAmount: number, order: "ASC" | "DESC") => {
      return `/tarefa/consulta-com-paginacao?quan-registros=${registersAmount}&pagina=0&ordenacao-tipo=${order}&ordenacao-chave=ORDENACAO_DATA_PREVISTA`;
    },
    tarefaDetails: (codigoTarefaEvento: number, codigoProcesso: number) => {
      return `/processo/${codigoProcesso}/tarefa/${codigoTarefaEvento}`;
    },
    quadrosKanban: (codigoUsuario?: number) => {
      if (!codigoUsuario) return "";
      return `/tipo?chave-tipo=kanbanTarefa(codigoUsuario:${codigoUsuario})`;
    },
    colunasKanban: (codigoQuadroKanban?: number) => {
      if (!codigoQuadroKanban) return "";
      return `/kanban/tarefa/${codigoQuadroKanban}`;
    },
    updateTarefa: (action: TarefaUpdateActions, codigoTarefaEvento?: number) => {
      if (action !== "salvar" && !codigoTarefaEvento) return "";
      if (action === "salvar") return "/tarefa";
      return `/v2/tarefa/alterar-situacao/${codigoTarefaEvento}/situacao/${tarefaActions[action].code}`;
    },
    alterarColunaKanbanTarefa: (codigoTarefaEvento?: number) => {
      if (!codigoTarefaEvento) return "";
      return `/v2/tarefa/${codigoTarefaEvento}/alterar-coluna-kanban`;
    },
  };

  async function getProjurisAuthTokenWithinExpiration(): Promise<string> {
    // const tokenResponse = await chrome.storage.local.get(["projurisToken", "projurisExpiration"]);
    const projurisToken = localStorage.getItem("projurisToken") ?? "";
    const projurisExpiration: number = parseInt(localStorage.getItem("projurisExpiration") ?? "0");
    const tokenResponse = { projurisToken, projurisExpiration };

    const storedTokenIsEmpty = Object.keys(tokenResponse).length === 0;
    if (storedTokenIsEmpty === true) return await fetchAndStoreNewProjurisAuthToken();
    const tokenExpired = tokenResponse.projurisExpiration < new Date().getTime();
    if (tokenExpired) return await fetchAndStoreNewProjurisAuthToken();
    return tokenResponse.projurisToken;
  }

  async function fetchAndStoreNewProjurisAuthToken(): Promise<string> {
    const tokenObj = await fetchProjurisAuthToken();
    // await chrome.storage.local.set(tokenObj);
    localStorage.setItem("projurisToken", tokenObj.projurisToken);
    localStorage.setItem("projurisExpiration", `${tokenObj.projurisExpiration}`);

    return tokenObj.projurisToken;
  }

  async function fetchProjurisAuthToken(): Promise<ProjurisAccessToken> {
    const secret = `${envVars.PROJURIS_API_CLIENT_ID}:${envVars.PROJURIS_API_CLIENT_SECRET}`;
    const secretHash = btoa(secret);

    const params = {
      method: "POST",
      async: true,
      headers: {
        Authorization: `Basic ${secretHash}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=password&username=${envVars.PROJURIS_API_USERNAME}$$${envVars.PROJURIS_API_DOMAIN}&password=${envVars.PROJURIS_API_PASSWORD}`,
    };
    const response = await fetch(projurisLoginUri, params);
    const tokenData = await response.json();
    const now = new Date();
    const projurisExpiration = now.getTime() + tokenData.expires_in * 1000;
    return {
      projurisToken: tokenData.access_token,
      projurisExpiration,
    };
  }

  async function fetchTarefaDetails(codigoTarefaEvento: number, codigoProcesso: number): Promise<ReceivedTarefaDetails> {
    const endpoint = endpoints.tarefaDetails(codigoTarefaEvento, codigoProcesso);
    const response = await makeProjurisRequest({ endpoint, method: "GET" });
    return await response.json();
  }

  async function fetchTarefasFromFilter(filter: Filter): Promise<Tarefa[]> {
    const endpoint = endpoints.consultarTarefaComPaginacao(30, "ASC");
    const body = createQueryBody(filter);
    const response = await makeProjurisRequest({ endpoint, method: "POST", body });
    return await extractOptionsArray(response);
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

  async function makeProjurisRequest(fetchOptions: FetchOptions): Promise<Response> {
    const { endpoint, method } = fetchOptions;
    const body = "body" in fetchOptions ? fetchOptions.body : undefined;
    const uri = (projurisApiBase + endpoint).replaceAll(`/${endpoint}`, `${endpoint}`);
    const token = await getProjurisAuthTokenWithinExpiration();
    const params = {
      method,
      async: true,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    };

    return fetch(uri, params);
  }

  function createFilterObject(filterObject?: Partial<ProjurisOptionsFilter>) {
    const standardFilter: ProjurisOptionsFilter = {
      key: "valor",
      operator: "insentiviveIncludes",
      val: "",
      flattenOptions: false,
    };
    return { ...standardFilter, ...filterObject };
  }

  async function loadSimpleOptions(endpoint?: string, filterObject?: Partial<ProjurisOptionsFilter>, shallMap = true): Promise<any[]> {
    if (!endpoint) return [];
    const requestOptions: FetchOptions = {
      endpoint,
      method: "GET",
    };
    const optionsPromise = await makeProjurisRequest(requestOptions);
    const rawOptions = await extractOptionsArray(optionsPromise);
    const filter = createFilterObject(filterObject);
    const options = filter?.flattenOptions ? flattenObjectsArray(rawOptions) : rawOptions;
    let filteredOptions = options;
    if (filter) {
      filteredOptions = options.filter((option: any) => {
        return compareWithOperator(option[filter.key], filter.operator, filter.val);
      });
    }
    filteredOptions.forEach((option: any) => {
      delete option.nodeWs;
      delete option.codigoModulo;
    });
    if (shallMap) {
      return filteredOptions.map((option: any) => {
        return {
          ...option,
          value: option.chave ?? option.codigoAssunto ?? option.codigo ?? option.codigoMarcador,
          label: option.valor ?? option.nomeAssunto ?? option.titulo ?? option.nomeMarcador,
        };
      });
    } else {
      return filteredOptions;
    }
  }

  async function extractOptionsArray(projurisFetchResponse: Response) {
    if (projurisFetchResponse.status === 204) return "no content";
    const jsonResp = await projurisFetchResponse.json();
    if (jsonResp.simpleDto) return jsonResp.simpleDto;
    if (jsonResp.consultaTipoRetorno && jsonResp.consultaTipoRetorno[0].simpleDto) return jsonResp.consultaTipoRetorno[0].simpleDto;
    if (jsonResp.nodeWs) return jsonResp.nodeWs;
    if (jsonResp.tarefaTipoConsultaWs) return jsonResp.tarefaTipoConsultaWs;
    if (jsonResp.andamentoTipoConsultaWs) return jsonResp.andamentoTipoConsultaWs;
    if (jsonResp.assuntoWs) return jsonResp.assuntoWs;
    if (jsonResp.marcadorWs) return jsonResp.marcadorWs;
    if (jsonResp.processoConsultaWs) return jsonResp.processoConsultaWs;
    if (jsonResp.pessoaConsulta) return jsonResp.pessoaConsulta;
    if (jsonResp.pessoaConsultaSimples) return jsonResp.pessoaConsultaSimples;
    if (jsonResp.campoDinamicoWs) return jsonResp.campoDinamicoWs;
    if (jsonResp.contaConsultaResultadoWs) return jsonResp.contaConsultaResultadoWs;
    if (jsonResp.tarefaConsultaWs) return jsonResp.tarefaConsultaWs;
    if (jsonResp.colunaKanbanTarefaWs) {
      return jsonResp.colunaKanbanTarefaWs.map((colunaKb: any) => ({
        chave: colunaKb.codigo,
        valor: colunaKb.titulo,
        situacao: colunaKb.situacaoTarefa,
      }));
    }
    return;
  }

  type DocumentWithChildren = SimpleDocument & { nodeWs?: DocumentWithChildren };
  type DocumentWithParent = SimpleDocument & { parent?: string };

  function flattenObjectsArray(objsArray: DocumentWithChildren[], parent?: string, res: DocumentWithParent[] = []) {
    objsArray.forEach(obj => {
      const { chave, valor, nodeWs: children } = obj;
      res.push({ chave, valor, parent });
      if (Array.isArray(children) && children.length > 0) {
        flattenObjectsArray(children, valor, res);
      }
    });
    return res;
  }

  async function dispatchBackendTarefaUpdate(params: TarefaUpdateParams): Promise<void> {
    const { type, name, reloadFunction } = params;
    const tarefa = type === "salvar" ? params.tarefa : undefined;
    const { codigoTarefaEvento, findingCode } = type !== "salvar" ? params : { codigoTarefaEvento: undefined, findingCode: undefined };
    if (name === undefined) return;
    if ((type === "salvar" && !tarefa) || (type !== "salvar" && !codigoTarefaEvento)) return;
    if (!confirm(`Tem certeza de que deseja ${type.toUpperCase()} a tarefa?`)) return;
    const progressMsg = generateProgressMessage(type);
    addMessage(progressMsg);
    const bodyObj = type === "salvar" ? tarefa : await fetchPayloadsForUpdatingKanban(type, codigoTarefaEvento!, findingCode!);
    const { responseAction, responseKanban } = await makeRequestsForUpdatingTarefa(type, JSON.stringify(bodyObj), codigoTarefaEvento);
    removeMessage(progressMsg);
    if (reloadFunction) reloadFunction();
    const msg = generateResponseMessage(name, type, responseAction, responseKanban);
    addMessage(msg);
  }

  async function fetchPayloadsForUpdatingKanban(type: keyof typeof tarefaActions, codigoTarefaEvento: number, param: FindingCode) {
    const quadroKanban =
      "codigoQuadroKanban" in param ? param.codigoQuadroKanban : await fetchCodigoQuadroKanbanForTarefa(codigoTarefaEvento, param.codigoProcesso);
    const colunasKanban: SimpleDocument[] = await loadSimpleOptions(endpoints.colunasKanban(quadroKanban), {}, false);
    const concludedObj = colunasKanban.find(coluna => coluna.valor.toLowerCase() === tarefaActions[type].name.toLowerCase());
    const concludedCode = concludedObj?.chave;
    if (!concludedCode) throw new Error(`Não foi possível encontrar um código para a situação \"${tarefaActions[type].name}\".`);
    return {
      codigoColuna: concludedCode,
      codigoQuadro: quadroKanban,
      atualizarSituacaoTarefa: false,
      codigoTarefaAnterior: 0,
      codigoTarefaPosterior: 0,
    };
  }

  async function fetchCodigoQuadroKanbanForTarefa(codigoTarefaEvento: number, codigoProcesso: number): Promise<number> {
    const tarefaDetails = await fetchTarefaDetails(codigoTarefaEvento, codigoProcesso);
    return tarefaDetails.tarefaEventoWs.quadroKanban.chave;
  }

  async function makeRequestsForUpdatingTarefa(type: TarefaUpdateActions, body: string, codigoTarefaEvento?: number) {
    const endpointKanban = endpoints.alterarColunaKanbanTarefa(codigoTarefaEvento);
    if (type !== "salvar" && !endpointKanban) {
      const errorMsg = "Não encontramos um endpoint para alterar a coluna do Kanban - função makeRequestsForConcludingTarefa().";
      addMessage({ type: "error", text: errorMsg });
      throw new Error(errorMsg);
    }
    const endpointAction = endpoints.updateTarefa(type, codigoTarefaEvento);
    if (!endpointAction) {
      const errorMsg = `Não encontramos um endpoint para ${type} a tarefa - função makeRequestsForConcludingTarefa().`;
      addMessage({ type: "error", text: errorMsg });
      throw new Error(errorMsg);
    }
    const responseKanban = endpointKanban ? await makeProjurisRequest({ method: "PUT", endpoint: endpointKanban, body }) : new Response();
    const responseAction = await makeProjurisRequest({ method: "PUT", endpoint: endpointAction, body: type === "salvar" ? body : "" });
    return { responseAction, responseKanban };
  }

  return {
    endpoints,
    makeProjurisRequest,
    loadSimpleOptions,
    createFilterObject,
    extractOptionsArray,
    fetchTarefasFromFilter,
    fetchTarefaDetails,
    dispatchBackendTarefaUpdate,
  };
}
