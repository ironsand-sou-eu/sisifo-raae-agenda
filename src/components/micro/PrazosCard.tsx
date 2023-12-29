export type PrazosCardProps = {
  situacao?: string;
  prazoAdmString?: string;
  prazoFatalString?: string;
  dataConclusaoString?: string;
  prazoStyle?: string;
};

export default function PrazosCard({ situacao, prazoAdmString, prazoFatalString, dataConclusaoString, prazoStyle }: PrazosCardProps): JSX.Element {
  return (
    <p className={`prazo ${prazoStyle}`}>{`Prazo: ${prazoAdmString}
      Fatal: ${prazoFatalString}
      Situação: ${situacao}${dataConclusaoString}`}</p>
  );
}

// TODO: codigoUsuarioCriador: 89323
