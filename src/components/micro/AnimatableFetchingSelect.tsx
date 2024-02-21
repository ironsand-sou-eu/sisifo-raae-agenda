import { useAnimations } from "../hooks/providers/AnimationsProvider";
import FetchingSelect, { FetchingSelectProps } from "./FetchingSelect";
import { useEffect } from "react";

type AnimatableFetchingSelectProps = FetchingSelectProps & {
  condition: boolean;
  refType: "colunaKanban" | "newTarefaColunaKanban";
};

export default function AnimatableFetchingSelect({
  condition,
  refType,
  ...rest
}: AnimatableFetchingSelectProps): JSX.Element {
  const { elementRef, setDisplayingAnimation } = useAnimations();

  useEffect(() => setDisplayingAnimation("colunaKanban"), [condition]);

  return (
    <>
      {condition && (
        <div ref={elementRef ? elementRef[refType] : undefined}>
          <FetchingSelect {...rest} />
        </div>
      )}
    </>
  );
}
