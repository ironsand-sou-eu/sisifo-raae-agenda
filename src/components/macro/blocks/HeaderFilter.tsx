import HeaderFilterHeader from "./HeaderFilterHeader";
import HeaderFilterBody from "./HeaderFilterBody";
import AnimationContainer from "../../micro/AnimationContainer";
import { AnimationsContext, useAnimations } from "../../hooks/providers/AnimationsProvider";
import { useId } from "react";

export default function HeaderFilter(): JSX.Element {
  const { isVisible } = useAnimations() as AnimationsContext;
  const filterBodyId = useId();

  return (
    <aside className="filter">
      <HeaderFilterHeader animatableElementId={filterBodyId} />
      {isVisible(filterBodyId) && (
        <AnimationContainer
          id={filterBodyId}
          displayingInlineStyle={{ animation: "drop-filter 500ms normal ease-in-out" }}
          hidingInlineStyle={{ animation: "pickup-filter 500ms normal ease-in-out" }}
        >
          <HeaderFilterBody />
        </AnimationContainer>
      )}
    </aside>
  );
}
