type ProcessoInfoCardProps = {
  parteAtiva: string;
  partePassiva: string;
  numeroProcesso: string;
  processoUrl?: string;
};

export default function ProcessoInfoCard({ parteAtiva, partePassiva, numeroProcesso, processoUrl }: ProcessoInfoCardProps): JSX.Element {
  return (
    <div className="processo-info">
      <p>{parteAtiva}</p>
      <p>{partePassiva}</p>
      <a href={processoUrl}>{numeroProcesso}</a>
    </div>
  );
}
