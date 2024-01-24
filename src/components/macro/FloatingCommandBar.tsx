import { useTarefasList } from "../hooks/TarefasListProvider";
import HeaderButton from "../micro/HeaderButton";

type FloatingCommandBarProps = {};

export default function FloatingCommandBar(): JSX.Element {
  const { selectedTarefas } = useTarefasList();

  return (
    <section className="card floating-command-bar">
      <HeaderButton type="cancel" onClick={e => console.log(selectedTarefas)} />
      <HeaderButton type="conclude" onClick={e => console.log(selectedTarefas)} />
    </section>
  );
}
