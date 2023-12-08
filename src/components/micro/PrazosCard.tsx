export type PrazosCardProps = {
  situacao?: string;
  dataConclusao?: number;
  dataConclusaoPrevista?: number;
  dataLimite?: number;
};

function getPrazoStyle(prazo?: Date): string {
  if (!prazo) return "danger";
  if (new Date().toLocaleDateString("pt-BR") === prazo.toLocaleDateString("pt-BR")) return "danger";
  if (new Date().getTime() >= prazo.getTime()) return "lost";
  const daysInMs = 2 * 24 * 60 * 60 * 1000;
  if (new Date().getTime() >= prazo.getTime() - daysInMs) return "warning";
  return "normal";
}

export default function PrazosCard({
  situacao,
  dataConclusao,
  dataConclusaoPrevista,
  dataLimite,
}: PrazosCardProps): JSX.Element {
  const prazoAdm = dataConclusaoPrevista ? new Date(dataConclusaoPrevista) : undefined;
  const prazoAdmString = prazoAdm ? prazoAdm.toLocaleDateString("pt-BR") : "Não encontrado";
  const prazoFatalString = dataLimite ? new Date(dataLimite).toLocaleDateString("pt-BR") : "Não encontrado";
  const dataConclusaoString = dataConclusao ? ` em ${new Date(dataConclusao)}` : "";

  return (
    <p className={`prazo ${getPrazoStyle(prazoAdm)}`}>{`Prazo: ${prazoAdmString}
      Fatal: ${prazoFatalString}
      Situação: ${situacao ?? "Não encontrada"}${dataConclusaoString}`}</p>
  );
}

//     codigoUsuarioCriador: 89323,
//     dataConclusao: undefined,
