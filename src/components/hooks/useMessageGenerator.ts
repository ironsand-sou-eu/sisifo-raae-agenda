import { Notification } from "../../global";
import { capitalizeFirstLetter } from "../../utils/utils";
import { CreatableEntities } from "./connectors/useProjurisCreateEntitiesConnector";
import { TarefaUpdateActions } from "./connectors/useProjurisTarefasConnector";

type Noun = {
  [key in CreatableEntities]: { withArticle: string; withoutArticle: string; gender: "masculine" | "feminine" };
};

export function useMessageGenerator() {
  const nouns: Noun = {
    tarefa: { withArticle: "a tarefa", withoutArticle: "tarefa", gender: "feminine" },
    newTarefa: { withArticle: "a tarefa", withoutArticle: "tarefa", gender: "feminine" },
    andamento: { withArticle: "o andamento", withoutArticle: "andamento", gender: "masculine" },
    timesheet: { withArticle: "o registro de horas", withoutArticle: "registro de horas", gender: "masculine" },
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
        entityType: Extract<CreatableEntities, "tarefa">;
        mainResponse: Response;
        kanbanResponse: Response;
      }
    | {
        action: "criar";
        entityType: Exclude<CreatableEntities, "tarefa">;
        mainResponse: Response;
      };

  const generateNotification = {
    progress: (action: TarefaUpdateActions | "criar", entityType: CreatableEntities): Notification => {
      return {
        type: "progress",
        text: `${capitalizeFirstLetter(verbs[action].gerund)} ${nouns[entityType].withoutArticle}...`,
      };
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

    response: async (params: ResponseNotificationParams): Promise<Notification> => {
      const { action, entityName, entityType, mainResponse, kanbanResponse } = {
        entityName: undefined,
        kanbanResponse: undefined,
        ...params,
      };
      const entityGender = nouns[entityType].gender;

      const responsesToCheck = [mainResponse];
      if (kanbanResponse) responsesToCheck.push(kanbanResponse);
      const errorLocation = getErrorLocation(responsesToCheck);

      if (!kanbanResponse) {
        if (mainResponse.ok) {
          const entity = entityName ? ' "' + entityName + '"' : "";
          return {
            type: "success",
            text: `${capitalizeFirstLetter(nouns[entityType].withoutArticle)}${entity} ${
              verbs[action].participle[entityGender]
            } com sucesso!`,
          };
        } else {
          return {
            type: "error",
            text: `Não foi possível ${verbs[action].infinitive} ${
              nouns[entityType].withArticle
            } por erro ${errorLocation}.\n
            Erro: ${await parseError(mainResponse)}`,
          };
        }
      } else {
        if (mainResponse.ok && kanbanResponse.ok) {
          return {
            type: "success",
            text: `${capitalizeFirstLetter(nouns[entityType].withoutArticle)} "${entityName}" (com kanban) ${
              verbs[action].participle[entityGender]
            } com sucesso!`,
          };
        } else if (mainResponse.ok && !kanbanResponse.ok) {
          return {
            type: "error",
            text: `${capitalizeFirstLetter(nouns[entityType].withoutArticle)} ${entityName} ${
              verbs[action].participle[entityGender]
            } com sucesso, mas não foi possível ajustar o quadro kanban por erro ${errorLocation}.\n
            Erro: ${await parseError(kanbanResponse)}`,
          };
        } else if (!mainResponse.ok && kanbanResponse.ok) {
          return {
            type: "error",
            text: `Kanban d${
              nouns[entityType].withArticle
            } "${entityName}" ajustado com sucesso, mas não foi possível ${verbs[action].infinitive} ${
              nouns[entityType].withArticle
            } por erro ${errorLocation}.\n
            Erro: ${await parseError(mainResponse)}`,
          };
        } else {
          return {
            type: "error",
            text: `Não foi possível ${verbs[action].infinitive} ${
              nouns[entityType].withArticle
            } nem ajustar o quadro kanban por erro ${errorLocation}.\n
            Erro: ${await parseError(mainResponse)}\n${await parseError(kanbanResponse)}`,
          };
        }
      }
    },
  };

  type ProjurisValidationError = {
    validacao: { chaveLocalErro: string; itemValidacao: { chaveErro: string }[] }[];
  };

  async function parseError(response: Response): Promise<string> {
    const jsonResponse: ProjurisValidationError = await response.json();
    const errors = jsonResponse.validacao.map(error => `${error.chaveLocalErro} - ${error.itemValidacao[0].chaveErro}`);
    return errors.join("\n");
  }

  function getErrorLocation(resps: Response[]): string {
    if (!resps.some(resp => !resp.ok)) return "não há erros";
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
