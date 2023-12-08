import { Dispatch, SetStateAction } from "react";
import Cancel from "./Cancel";
import Conclude from "./Conclude";
import Edit from "./Edit";
import { TarefaRenderingDetails } from "./TarefaDetailedCard";

type TarefaDetailedHeaderProps = {
  setRenderDetails: Dispatch<SetStateAction<TarefaRenderingDetails | undefined>>;
  tipoTarefa?: string;
  titulo?: string;
};

export default function TarefaDetailedHeader({
  tipoTarefa,
  titulo,
  setRenderDetails,
}: TarefaDetailedHeaderProps): JSX.Element {
  return (
    <header className="tarefa-card-titulo">
      <div onClick={() => setRenderDetails(undefined)} className="close-btn">
        +
      </div>
      <h2>{titulo ?? tipoTarefa ?? ""}</h2>
      <div>
        <Cancel onClick={e => console.log(e)} />
        <Edit onClick={e => console.log(e)} />
        <Conclude onClick={e => console.log(e)} />
      </div>
    </header>
  );
}
