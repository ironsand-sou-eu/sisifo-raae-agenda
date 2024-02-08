import { SimpleDocument } from "../../global";
import { projurisApiBase } from "../../hardcoded";
import { Operator, compareWithOperator } from "../../utils/utils";
import useProjurisAuthConnector from "./useProjurisAuthConnector";
import { TarefaUpdateActions, tarefaActions } from "./useProjurisTarefasConnector";

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

type DocumentWithChildren = SimpleDocument & { nodeWs?: DocumentWithChildren };
type DocumentWithParent = SimpleDocument & { parent?: string };

export default function useProjurisConnector() {
  const { getProjurisAuthTokenWithinExpiration } = useProjurisAuthConnector();
  const endpoints = {
    // buscarProcessoPorNumero: "/processo/consulta?filtro-geral=",
    // camposDinamicos: "/campo-dinamico/3/13",
    criarAndamento: "/andamento",
    gruposTrabalho: "/grupo/",
    marcadores: "/marcador/consulta/",
    responsaveis: "/usuario/",
    situacoesTarefa: "/tipo?chave-tipo=tarefa-evento-situacao(chaveModulo:null)",
    tiposAndamento: "/andamento-tipo/consulta?",
    tiposTarefa: "/tipo?chave-tipo=tarefa-tipo",
    alterarColunaKanbanTarefa: (codigoTarefaEvento?: number) => {
      if (!codigoTarefaEvento) return "";
      return `/v2/tarefa/${codigoTarefaEvento}/alterar-coluna-kanban`;
    },
    colunasKanban: (codigoQuadroKanban?: number) => {
      if (!codigoQuadroKanban) return "";
      return `/kanban/tarefa/${codigoQuadroKanban}`;
    },
    consultarTarefaComPaginacao: (pageNumber: number, registersAmount: number, order: "ASC" | "DESC") => {
      return `/tarefa/consulta-com-paginacao?quan-registros=${registersAmount}&pagina=${pageNumber}&ordenacao-tipo=${order}&ordenacao-chave=ORDENACAO_DATA_PREVISTA`;
    },
    criarTimesheet: (codigoProcesso: number) => {
      if (!codigoProcesso) return "";
      return `/processo/${codigoProcesso}/apontamento-horas`;
    },
    processoVisaoCompleta: (codigoProcesso: number) => {
      if (!codigoProcesso) return "";
      return `casos/processo/visao-completa/${codigoProcesso}`;
    },
    quadrosKanban: (codigoUsuario?: number) => {
      if (!codigoUsuario) return "";
      return `/tipo?chave-tipo=kanbanTarefa(codigoUsuario:${codigoUsuario})`;
    },
    tarefaDetails: (codigoTarefaEvento: number, codigoProcesso: number) => {
      return `/processo/${codigoProcesso}/tarefa/${codigoTarefaEvento}`;
    },
    updateTarefa: (action: TarefaUpdateActions, codigoTarefaEvento?: number) => {
      if (action === "salvar") return "/tarefa";
      if (!codigoTarefaEvento) return "";
      return `/v2/tarefa/alterar-situacao/${codigoTarefaEvento}/situacao/${tarefaActions[action].code}`;
    },
  };

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

  async function loadSimpleOptions(
    endpoint?: string,
    filterObject?: Partial<ProjurisOptionsFilter>,
    shallMap = true
  ): Promise<SimpleDocument[]> {
    if (!endpoint) return [];
    const requestOptions: FetchOptions = {
      endpoint,
      method: "GET",
    };
    const optionsPromise = await makeProjurisRequest(requestOptions);
    const rawOptions = await extractOptionsArray<SimpleDocument>(optionsPromise);
    if (!rawOptions) return [];
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

  async function extractOptionsArray<T>(projurisFetchResponse: Response): Promise<T[] | undefined> {
    if (projurisFetchResponse.status === 204) return;
    const jsonResp = await projurisFetchResponse.json();
    if (jsonResp.simpleDto) return jsonResp.simpleDto;
    if (jsonResp.consultaTipoRetorno && jsonResp.consultaTipoRetorno[0].simpleDto)
      return jsonResp.consultaTipoRetorno[0].simpleDto;
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
  }

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

  return {
    endpoints,
    makeProjurisRequest,
    loadSimpleOptions,
    createFilterObject,
    extractOptionsArray,
  };
}
