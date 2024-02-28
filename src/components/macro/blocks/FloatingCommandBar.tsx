import { useTarefasList } from "../../hooks/providers/TarefasListProvider";
import useProjurisTarefasConnector from "../../hooks/connectors/useProjurisTarefasConnector";
import useTarefasAdapter from "../../hooks/adapters/useTarefasAdapter";
import HeaderButton from "../../micro/HeaderButton";

export default function FloatingCommandBar(): JSX.Element {
  const { selectedTarefas, loadListFromScratch } = useTarefasList();
  const { dispatchBackendTarefaUpdate } = useProjurisTarefasConnector();
  const { adaptTarefasListToUpdatingParams } = useTarefasAdapter();

  return (
    <section className="card floating-command-bar">
      <HeaderButton
        type="cancel"
        onClick={() =>
          dispatchBackendTarefaUpdate(
            adaptTarefasListToUpdatingParams(selectedTarefas, "cancelar", loadListFromScratch)
          )
        }
      />
      <HeaderButton
        type="conclude"
        onClick={() =>
          dispatchBackendTarefaUpdate(
            adaptTarefasListToUpdatingParams(selectedTarefas, "concluir", loadListFromScratch)
          )
        }
      />
    </section>
  );
}
