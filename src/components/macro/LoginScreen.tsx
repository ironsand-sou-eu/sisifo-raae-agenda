import Messenger from "./Messenger";

export default function LoginScreen() {
  return (
    <>
      <main>
        <section className="card tarefa-card tarefa-detailed-card" style={{ top: "15dvh" }}>
          <header className="tarefa-card-titulo">
            <h2>Faça login no navegador</h2>
          </header>
          <div>
            Para acessar as funcionalidades do Sísifo Agenda, você deve estar logado no navegador com sua conta
            corporativa.
          </div>
        </section>
        <Messenger />
      </main>
    </>
  );
}
