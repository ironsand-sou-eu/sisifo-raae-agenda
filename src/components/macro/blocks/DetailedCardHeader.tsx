type DetailedCardHeaderProps = {
  caption?: string;
  circleColor?: string;
  closeFunction?: (...args: any[]) => void;
  rightDiv?: JSX.Element;
};

export default function DetailedCardHeader({
  caption,
  circleColor,
  closeFunction,
  rightDiv,
}: DetailedCardHeaderProps): JSX.Element {
  return (
    <header className="tarefa-card-titulo">
      <div onClick={closeFunction} className="close-btn">
        +
      </div>
      <div>
        <div style={{ backgroundColor: circleColor }} className="circle" />
        <h2>{caption}</h2>
      </div>
      {rightDiv}
    </header>
  );
}
