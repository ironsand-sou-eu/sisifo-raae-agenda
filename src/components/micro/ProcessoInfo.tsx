import { projurisAppBase } from "../../hardcoded";
import useProjurisConnector from "../hooks/useProjurisConnector";

type ProcessoInfoProps = {
  parteAtiva: string;
  partePassiva: string;
  numeroProcesso: string;
  codigoProcessoProjuris?: number;
};

export default function ProcessoInfo({
  parteAtiva,
  partePassiva,
  numeroProcesso,
  codigoProcessoProjuris,
}: ProcessoInfoProps): JSX.Element {
  const { endpoints } = useProjurisConnector();

  const processoUrl = codigoProcessoProjuris
    ? projurisAppBase + endpoints.processoVisaoCompleta + codigoProcessoProjuris
    : "";

  return (
    <div className="processo-info">
      {parteAtiva}
      <br />
      {partePassiva}
      <br />
      <a href={processoUrl}>{numeroProcesso}</a>
    </div>
  );
}
