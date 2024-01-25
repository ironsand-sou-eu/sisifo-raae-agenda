import { useTarefasList } from "../hooks/TarefasListProvider";
import useProjurisConnector from "../hooks/useProjurisConnector";
import useTarefasAdapter from "../hooks/useTarefasAdapter";
import HeaderButton from "../micro/HeaderButton";

export default function FloatingCommandBar(): JSX.Element {
  const { selectedTarefas, loadList } = useTarefasList();
  const { dispatchBackendTarefaUpdate } = useProjurisConnector();
  const { adaptTarefasListToUpdatingParams } = useTarefasAdapter();

  return (
    <section className="card floating-command-bar">
      <HeaderButton
        type="cancel"
        onClick={() => dispatchBackendTarefaUpdate(adaptTarefasListToUpdatingParams(selectedTarefas, "cancelar", loadList))}
      />
      <HeaderButton
        type="conclude"
        onClick={() => dispatchBackendTarefaUpdate(adaptTarefasListToUpdatingParams(selectedTarefas, "concluir", loadList))}
      />
    </section>
  );
}
