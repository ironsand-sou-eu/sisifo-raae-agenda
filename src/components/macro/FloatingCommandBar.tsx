import { useTarefasList } from "../hooks/TarefasListProvider";
import useProjurisTarefasConnector from "../hooks/useProjurisTarefasConnector";
import useTarefasAdapter from "../hooks/useTarefasAdapter";
import HeaderButton from "../micro/HeaderButton";

export default function FloatingCommandBar(): JSX.Element {
  const { selectedTarefas, loadList } = useTarefasList();
  const { dispatchBackendTarefaUpdate } = useProjurisTarefasConnector();
  const { adaptTarefasListToUpdatingParams } = useTarefasAdapter();

  return (
    <section className="card floating-command-bar">
      <HeaderButton
        type="cancel"
        onClick={() =>
          dispatchBackendTarefaUpdate(adaptTarefasListToUpdatingParams(selectedTarefas, "cancelar", loadList))
        }
      />
      <HeaderButton
        type="conclude"
        onClick={() =>
          dispatchBackendTarefaUpdate(adaptTarefasListToUpdatingParams(selectedTarefas, "concluir", loadList))
        }
      />
    </section>
  );
}
