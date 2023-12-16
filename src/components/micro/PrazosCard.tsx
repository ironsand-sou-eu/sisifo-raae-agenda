export type PrazosCardProps = {
  situacao?: string;
  dataConclusao?: number;
  dataConclusaoPrevista?: number;
  dataLimite?: number;
};

function getPrazoStyle(prazo?: Date): string {
  if (!prazo) return "danger";
  const nowInMs = new Date().getTime();
  if (prazo.toLocaleDateString("pt-BR") === new Date().toLocaleDateString("pt-BR")) return "danger";
  if (prazo.getTime() < nowInMs) return "lost";
  const twoDaysBeforeDeadlineInMs = prazo.getTime() - 2 * 24 * 60 * 60 * 1000;
  if (twoDaysBeforeDeadlineInMs < nowInMs) return "warning";
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
  const dataConclusaoString = dataConclusao ? ` em ${new Date(dataConclusao).toLocaleDateString("pt-BR")}` : "";

  return (
    <p className={`prazo ${getPrazoStyle(prazoAdm)}`}>{`Prazo: ${prazoAdmString}
      Fatal: ${prazoFatalString}
      Situação: ${situacao ?? "Não encontrada"}${dataConclusaoString}`}</p>
  );
}

//     codigoUsuarioCriador: 89323,
//     dataConclusao: undefined,
