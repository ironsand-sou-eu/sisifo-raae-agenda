import { projurisApiBase } from "../../hardcoded";
import useProjurisConnector from "../hooks/useProjurisConnector";

type ProcessoInfoCardProps = {
  parteAtiva: string;
  partePassiva: string;
  numeroProcesso: string;
  codigoProcessoProjuris?: number;
};

export default function ProcessoInfoCard({ parteAtiva, partePassiva, numeroProcesso, codigoProcessoProjuris }: ProcessoInfoCardProps): JSX.Element {
  const { endpoints } = useProjurisConnector();

  const processoUrl = codigoProcessoProjuris ? projurisApiBase + endpoints.processoVisaoCompleta + codigoProcessoProjuris : "";

  return (
    <div className="processo-info">
      <p>{parteAtiva}</p>
      <p>{partePassiva}</p>
      <a href={processoUrl}>{numeroProcesso}</a>
    </div>
  );
}
