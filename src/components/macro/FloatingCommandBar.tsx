import HeaderButton from "../micro/HeaderButton";

type FloatingCommandBarProps = {};

export default function FloatingCommandBar(): JSX.Element {
  return (
    <section className="card floating-command-bar">
      <HeaderButton type="cancel" onClick={e => console.log(e)} />
      <HeaderButton type="conclude" onClick={e => console.log(e)} />
    </section>
  );
}
