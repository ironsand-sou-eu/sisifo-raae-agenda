import { Message } from "../../global";
import { capitalizeFirstLetter } from "../../utils/utils";
import { TarefaUpdateActions } from "./useProjurisConnector";

export function useMessageGenerator() {
  const verbs = {
    concluir: { infinitive: "concluir", participle: "concluída", gerundio: "concluindo" },
    cancelar: { infinitive: "cancelar", participle: "cancelada", gerundio: "cancelando" },
    salvar: { infinitive: "salvar", participle: "salva", gerundio: "salvando" },
  };

  function generateProgressMessage(type: TarefaUpdateActions): Message {
    return { type: "progress", text: `${capitalizeFirstLetter(verbs[type].gerundio)} tarefa...` };
  }

  function generateResponseMessage(
    nome: string,
    type: "concluir" | "cancelar" | "salvar",
    responseConclude: Response,
    responseKanban: Response
  ): Message {
    let errorLocation = "desconhecido";
    if (`${responseConclude.status}`.startsWith("5") || `${responseKanban.status}`.startsWith("5")) errorLocation = "no servidor";
    if (`${responseConclude.status}`.startsWith("4") || `${responseKanban.status}`.startsWith("4")) errorLocation = "na solicitação";

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
  }

  return { generateResponseMessage, generateProgressMessage };
}
