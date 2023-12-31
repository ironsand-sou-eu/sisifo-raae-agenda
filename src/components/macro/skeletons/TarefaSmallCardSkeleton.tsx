export default function TarefaSmallCardSkeleton(): JSX.Element {
  return (
    <section className="card tarefa-card">
      <header className="tarefa-card-titulo">
        <div>
          <div className="skeleton skeleton-circle" />
          <div className="skeleton skeleton-header" />
        </div>
        <div className="skeleton skeleton-buttons-area" />
      </header>
      <div className="processo-info">
        <p className="skeleton skeleton-text" />
        <p className="skeleton skeleton-text" />
        <p className="skeleton skeleton-text" />
        <p className="skeleton skeleton-text" />
      </div>
      <footer className="skeleton skeleton-text"></footer>
    </section>
  );
}
