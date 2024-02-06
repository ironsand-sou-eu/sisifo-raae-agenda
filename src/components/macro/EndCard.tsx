import { forwardRef } from "react";

type EndCardProps = {
  hasMore: boolean;
};

const EndCard = forwardRef<HTMLDivElement, EndCardProps>(function ({ hasMore }: EndCardProps, ref): JSX.Element {
  return (
    <section className="card tarefa-card">
      <div
        ref={ref}
        className="end-card"
        title={hasMore ? "Role a tela até o fim para carregar mais." : "Parabéns! Chegamos ao final."}
      >
        {hasMore ? "Carregar mais..." : "Fim! Por ora..."}
      </div>
    </section>
  );
});

export default EndCard;
