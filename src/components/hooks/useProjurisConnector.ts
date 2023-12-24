import envVars from "../../envVars";
import { Tarefa } from "../../global";
import { projurisApiBase, projurisLoginUri } from "../../hardcoded";
import { Filter } from "./FiltersProvider";

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

export type TarefaDetails = {
  modulos: [
    {
      modulo: string;
      codigoRegistroVinculo: number;
      vinculoPrincipal: boolean;
    }
  ];
  codigoTarefa: number;
  tarefaEventoWs: {
    codigoTarefaEvento: number;
    codigoUsuarioCriador: number;
    descricaoTarefa: string;
    identificador: string;
    dataConclusao?: number;
    dataConclusaoPrevista: number;
    horaConclusao: number;
    horaLimite: number;
    dataLimite: number;
    dataBase: number;
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

type Operator = "sensitiveStrictEquality" | "insensitiveStrictEquality" | "insentiviveIncludes" | "includes" | "numericEquality";

export default function useProjurisConnector() {
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
    criarTarefa: "/tarefa",
    consultarTarefaComPaginacao: (registersAmount: number, order: "ASC" | "DESC") => {
      return `/tarefa/consulta-com-paginacao?quan-registros=${registersAmount}&pagina=0&ordenacao-tipo=${order}&ordenacao-chave=ORDENACAO_DATA_PREVISTA`;
    },
    tarefaDetails: (codigoTarefaEvento: number, codigoProcesso: number) => {
      return `/processo/${codigoProcesso}/tarefa/${codigoTarefaEvento}`;
    },
    quadrosKanban: (codigoUsuario?: number) => {
      if (!codigoUsuario) return;
      return `/tipo?chave-tipo=kanbanTarefa(codigoUsuario:${codigoUsuario})`;
    },
    colunasKanban: (codigoQuadroKanban?: number) => {
      if (!codigoQuadroKanban) return;
      return `/kanban/tarefa/${codigoQuadroKanban}`;
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

  type FetchOptions =
    | {
        endpoint: string;
        method: "GET";
      }
    | {
        endpoint: string;
        method: "POST";
        body: string;
      };

  async function fetchTarefaDetails(codigoTarefaEvento: number, codigoProcesso: number): Promise<TarefaDetails> {
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

  // async function fetchTarefaDetails(codigoTarefaEvento: number, codigoProcesso: number): Promise<TarefaDetails> {
  //   const endpoint = endpoints.tarefaDetails(codigoTarefaEvento, codigoProcesso);
  //   const response = await makeProjurisRequest({ endpoint, method: "GET" });
  //   return
  // }

  async function makeProjurisRequest(fetchOptions: FetchOptions): Promise<Response> {
    const { endpoint, method } = fetchOptions;
    const body = "body" in fetchOptions ? fetchOptions.body : undefined;
    const uri = (projurisApiBase + endpoint).replaceAll(`/${endpoint}`, `${endpoint}`);
    const token = await getProjurisAuthTokenWithinExpiration();
    const params = {
      method: method,
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

  async function loadSimpleOptions(endpoint?: string, filterObject?: ProjurisOptionsFilter, shallMap = true): Promise<any[]> {
    if (!endpoint) return [];
    const requestOptions: FetchOptions = {
      endpoint,
      method: "GET",
    };
    const optionsPromise = await makeProjurisRequest(requestOptions);
    const rawOptions = await extractOptionsArray(optionsPromise);
    const options = filterObject?.flattenOptions ? flattenObjectsArray(rawOptions) : rawOptions;
    let filteredOptions = options;
    if (filterObject) {
      filteredOptions = options.filter((option: any) => {
        return compareWithOperator(option[filterObject.key], filterObject.operator, filterObject.val);
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
          value: option.chave ?? option.codigoAssunto ?? option.codigo,
          label: option.valor ?? option.nomeAssunto ?? option.titulo,
        };
      });
    } else {
      return filteredOptions;
    }
  }

  async function extractOptionsArray(projurisFetchResponse: Response): Promise<any> {
    if (projurisFetchResponse.status === 204) return "no content";
    const jsonResp = await projurisFetchResponse.json();
    if (jsonResp.simpleDto) return jsonResp.simpleDto;
    if (jsonResp.consultaTipoRetorno && jsonResp.consultaTipoRetorno[0].simpleDto) return jsonResp.consultaTipoRetorno[0].simpleDto;
    if (jsonResp.nodeWs) return jsonResp.nodeWs;
    if (jsonResp.colunaKanbanTarefaWs) return jsonResp.colunaKanbanTarefaWs;
    if (jsonResp.tarefaTipoConsultaWs) return jsonResp.tarefaTipoConsultaWs;
    if (jsonResp.andamentoTipoConsultaWs) return jsonResp.andamentoTipoConsultaWs;
    if (jsonResp.assuntoWs) return jsonResp.assuntoWs;
    if (jsonResp.processoConsultaWs) return jsonResp.processoConsultaWs;
    if (jsonResp.pessoaConsulta) return jsonResp.pessoaConsulta;
    if (jsonResp.pessoaConsultaSimples) return jsonResp.pessoaConsultaSimples;
    if (jsonResp.campoDinamicoWs) return jsonResp.campoDinamicoWs;
    if (jsonResp.contaConsultaResultadoWs) return jsonResp.contaConsultaResultadoWs;
    if (jsonResp.tarefaConsultaWs) return jsonResp.tarefaConsultaWs;
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

  function compareWithOperator(a: string, operator: Operator, b: string) {
    if (a === undefined || b === undefined) return false;
    switch (operator) {
      case "sensitiveStrictEquality":
        return a === b;
      case "insensitiveStrictEquality":
        return a.toString().toLowerCase() === b.toString().toLowerCase();
      case "insentiviveIncludes":
        return a.toLowerCase().includes(b.toLowerCase());
      case "includes":
        return a.includes(b);
      case "numericEquality":
        return Number(a) === Number(b);
    }
  }

  // function filterProjurisOptions(rawOptions, filterObject) {
  //   let flattenedOptions;
  //   if (filterObject.flattenOptions) flattenedOptions = flattenObjectsArray(rawOptions);
  //   const options = flattenedOptions ?? rawOptions;
  //   const filtered = options.filter(option =>
  //     compareWithOperator(option[filterObject.key], filterObject.operator, filterObject.val)
  //   );
  //   return filtered.length !== 0 ? filtered : undefined;
  // }

  return {
    endpoints,
    makeProjurisRequest,
    fetchTarefaDetails,
    loadSimpleOptions,
    extractOptionsArray,
    fetchTarefasFromFilter,
  };
}
