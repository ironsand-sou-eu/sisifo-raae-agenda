import { Notification } from "../../global";
import { capitalizeFirstLetter } from "../../utils/utils";
import { TarefaUpdateActions } from "./useProjurisConnector";

export function useMessageGenerator() {
  const verbs = {
    concluir: { infinitive: "concluir", participle: "concluída", gerundio: "concluindo" },
    cancelar: { infinitive: "cancelar", participle: "cancelada", gerundio: "cancelando" },
    salvar: { infinitive: "salvar", participle: "salva", gerundio: "salvando" },
  };

  const generateNotification = {
    progress: (type: TarefaUpdateActions): Notification => {
      return { type: "progress", text: `${capitalizeFirstLetter(verbs[type].gerundio)} tarefa...` };
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

    response: (
      nome: string,
      type: "concluir" | "cancelar" | "salvar",
      responseConclude: Response,
      responseKanban: Response
    ): Notification => {
      let errorLocation = "desconhecido";
      if (`${responseConclude.status}`.startsWith("5") || `${responseKanban.status}`.startsWith("5"))
        errorLocation = "no servidor";
      if (`${responseConclude.status}`.startsWith("4") || `${responseKanban.status}`.startsWith("4"))
        errorLocation = "na solicitação";

      if (responseConclude.ok && responseKanban.ok) {
        return { type: "success", text: `Tarefa ${nome} ${verbs[type].participle} com sucesso!` };
      } else if (responseConclude.ok && !responseKanban.ok) {
        return {
          type: "error",
          text: `Tarefa ${nome} ${verbs[type].participle} com sucesso, mas não foi possível ajustar o quadro kanban por erro ${errorLocation}.\n
            Erro: ${responseKanban.statusText}`,
        };
      } else if (!responseConclude.ok && responseKanban.ok) {
        return {
          type: "error",
          text: `Kanban da Tarefa ${nome} ajustado com sucesso, mas não foi possível ${type} a tarefa por erro ${errorLocation}.\n
            Erro: ${responseConclude.statusText}`,
        };
      } else {
        return {
          type: "error",
          text: `Não foi possível ${type} a tarefa nem ajustar o quadro kanban por erro ${errorLocation}.\n
            Erro: ${responseConclude.statusText}\n${responseKanban.statusText}`,
        };
      }
    },
  };

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
