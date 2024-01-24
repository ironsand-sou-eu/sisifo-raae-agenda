import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { TarefaPrefetchDetails } from "./TarefaDetailedCard";
import HeaderButton from "../micro/HeaderButton";
import { useTarefasList } from "../hooks/TarefasListProvider";
import useProjurisConnector from "../hooks/useProjurisConnector";

type TarefaSmallCardHeaderProps = {
  setPrefetchDetails: Dispatch<SetStateAction<TarefaPrefetchDetails | undefined>>;
  checked?: boolean;
  nomeTarefaTipo: string;
  codigoTarefaEvento: number;
  codigoProcesso: number;
  numeroProcesso: string;
  parteAtiva: string;
  partePassiva: string;
  tarefaColor: string;
};

export default function TarefaSmallCardHeader({
  checked,
  nomeTarefaTipo,
  parteAtiva,
  partePassiva,
  numeroProcesso,
  codigoTarefaEvento,
  codigoProcesso,
  tarefaColor,
  setPrefetchDetails,
}: TarefaSmallCardHeaderProps): JSX.Element {
  const { setTarefas, loadList } = useTarefasList();
  const { dispatchBackendTarefaUpdate } = useProjurisConnector();
  function renderDetails(): void {
    setPrefetchDetails({ parteAtiva, partePassiva, numeroProcesso, codigoProcesso, codigoTarefaEvento, tarefaColor });
  }

  function getCheckboxName(): string {
    return `chk-tarefa-${codigoProcesso}--${codigoTarefaEvento}`;
  }

  function getProcessoAndTarefaCodesFromCheckboxId(id: string): number[] {
    const codes = id.replace("chk-tarefa-", "");
    return codes.split("--").map(code => parseInt(code));
  }

  function handleSelect({ target: { id } }: ChangeEvent) {
    const [_, codTarefaEvento] = getProcessoAndTarefaCodesFromCheckboxId(id);
    setTarefas(prevValues => {
      if (!prevValues) return [];
      const index = prevValues?.findIndex(tarefa => tarefa.codigoTarefaEvento === codTarefaEvento);
      const clone = structuredClone(prevValues);
      clone[index].checked = !clone[index].checked;
      return clone;
    });
  }

  return (
    <header className="tarefa-card-titulo">
      <div>
        <input
          style={{ backgroundColor: tarefaColor }}
          className="tarefa-card-titulo-checkbox"
          type="checkbox"
          onChange={handleSelect}
          checked={checked}
          name={getCheckboxName()}
          id={getCheckboxName()}
        />
        <h2 onClick={renderDetails}>{nomeTarefaTipo}</h2>
      </div>
      <div>
        <HeaderButton
          type="cancel"
          onClick={() =>
            dispatchBackendTarefaUpdate({
              type: "cancelar",
              name: nomeTarefaTipo,
              codigoTarefaEvento,
              findingCode: { codigoProcesso },
              reloadFunction: loadList,
            })
          }
        />
        <HeaderButton type="timesheet" onClick={e => console.log(e)} />
        <HeaderButton
          type="conclude"
          onClick={() =>
            dispatchBackendTarefaUpdate({
              type: "concluir",
              name: nomeTarefaTipo,
              codigoTarefaEvento,
              findingCode: { codigoProcesso },
              reloadFunction: loadList,
            })
          }
        />
      </div>
    </header>
  );
}
