import { Notification } from "../../global";
import { capitalizeFirstLetter } from "../../utils/utils";
import { AndamentoUpdateActions } from "./useProjurisAndamentosConnector";
import { TarefaUpdateActions } from "./useProjurisTarefasConnector";

type PhrasalObject = "tarefa" | "andamento" | "timesheet";

export function useMessageGenerator() {
  const nouns = {
    tarefa: { withArticle: "a tarefa", withoutArticle: "tarefa" },
    andamento: { withArticle: "o andamento", withoutArticle: "andamento" },
    timesheet: { withArticle: "o registro de horas", withoutArticle: "registro de horas" },
  };

  const verbs = {
    cancelar: {
      infinitive: "cancelar",
      participle: { feminine: "cancelada", masculine: "cancelado" },
      gerund: "cancelando",
    },
    concluir: {
      infinitive: "concluir",
      participle: { feminine: "concluída", masculine: "concluído" },
      gerund: "concluindo",
    },
    criar: { infinitive: "criar", participle: { feminine: "criada", masculine: "criado" }, gerund: "criando" },
    salvar: { infinitive: "salvar", participle: { feminine: "salva", masculine: "salvo" }, gerund: "salvando" },
  };

  type ResponseNotificationParams =
    | {
        action: TarefaUpdateActions;
        entityName: string;
        entityType: Extract<PhrasalObject, "tarefa">;
        mainResponse: Response;
        kanbanResponse: Response;
      }
    | {
        action: AndamentoUpdateActions;
        entityType: Exclude<PhrasalObject, "tarefa">;
        mainResponse: Response;
      };

  const generateNotification = {
    progress: (action: TarefaUpdateActions | AndamentoUpdateActions, entityType: PhrasalObject): Notification => {
      return { type: "progress", text: `${capitalizeFirstLetter(verbs[action].gerund)} ${entityType}...` };
    },

    errorKanbanEndpointNotFound: (caller: string): Notification => {
      return {
        type: "error",
        text: `Não encontramos um endpoint para alterar a coluna do Kanban - função ${caller}().`,
      };
    },

    errorUpdateEndpointNotFound: (type: TarefaUpdateActions, caller: string): Notification => {
      return { type: "error", text: `Não encontramos um endpoint para ${type} a tarefa - função ${caller}().` };
    },

    response: (params: ResponseNotificationParams): Notification => {
      const { action, entityType, mainResponse, kanbanResponse, entityName } = {
        entityName: "",
        kanbanResponse: new Response(),
        ...params,
      };
      const errorLocation = getErrorLocation([mainResponse, kanbanResponse]);

      if (!kanbanResponse) {
        if (mainResponse.ok) {
          return {
            type: "success",
            text: `${capitalizeFirstLetter(nouns[entityType].withoutArticle)} "${entityName}" ${
              verbs[action].participle
            } com sucesso!`,
          };
        } else {
          return {
            type: "error",
            text: `Não foi possível ${verbs[action].infinitive} ${nouns[entityType].withArticle} por erro ${errorLocation}.\n
            Erro: ${mainResponse.statusText}`,
          };
        }
      } else {
        if (mainResponse.ok && kanbanResponse.ok) {
          return {
            type: "success",
            text: `${capitalizeFirstLetter(nouns[entityType].withoutArticle)} "${entityName}" (com kanban) ${
              verbs[action].participle
            } com sucesso!`,
          };
        } else if (mainResponse.ok && !kanbanResponse.ok) {
          return {
            type: "error",
            text: `${capitalizeFirstLetter(nouns[entityType].withoutArticle)} ${entityName} ${
              verbs[action].participle
            } com sucesso, mas não foi possível ajustar o quadro kanban por erro ${errorLocation}.\n
            Erro: ${kanbanResponse.statusText}`,
          };
        } else if (!mainResponse.ok && kanbanResponse.ok) {
          return {
            type: "error",
            text: `Kanban d${nouns[entityType].withArticle} "${entityName}" ajustado com sucesso, mas não foi possível ${verbs[action].infinitive} ${nouns[entityType].withArticle} por erro ${errorLocation}.\n
            Erro: ${mainResponse.statusText}`,
          };
        } else {
          return {
            type: "error",
            text: `Não foi possível ${verbs[action].infinitive} ${nouns[entityType].withArticle} nem ajustar o quadro kanban por erro ${errorLocation}.\n
            Erro: ${mainResponse.statusText}\n${kanbanResponse.statusText}`,
          };
        }
      }
    },
  };

  function getErrorLocation(resps: Response[]): string {
    if (resps.some(resp => !resp.ok)) return "não há erros";
    if (resps.some(resp => `${resp.status}`.startsWith("5"))) return "no servidor";
    if (resps.some(resp => `${resp.status}`.startsWith("4"))) return "na solicitação";
    return "desconhecido";
  }

  const generateStringMsg = {
    filterExclusionConfirmation: "Tem certeza de que deseja excluir o filtro?",
    newFilterNamePrompt: "Digite um nome para o novo filtro:",
    operationCancelled: "Operação cancelada.",
    confirmUpdate: (type: TarefaUpdateActions, plural?: boolean) => {
      return plural
        ? `Tem certeza de que deseja ${type.toUpperCase()} as tarefas?`
        : `Tem certeza de que deseja ${type.toUpperCase()} a tarefa?`;
    },
    filterAlreadyExists: (filterName: string) => `O filtro atual já está salvo, com o nome "${filterName}".`,
    situacaoCodeNotFound: (situacao: string) => `Não foi possível encontrar um código para a situação \"${situacao}\".`,
  };

  return { generateNotification, generateStringMsg };
}
