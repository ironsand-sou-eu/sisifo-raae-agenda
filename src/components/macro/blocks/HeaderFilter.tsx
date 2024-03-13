import HeaderFilterHeader from "./HeaderFilterHeader";
import HeaderFilterBody from "./HeaderFilterBody";
import AnimationContainer from "../../micro/AnimationContainer";
import { AnimationsContext, useAnimations } from "../../hooks/providers/AnimationsProvider";
import { useId, useEffect } from "react";
import { TarefasListContext, useTarefasList } from "../../hooks/providers/TarefasListProvider";

export default function HeaderFilter(): JSX.Element {
  const { isVisible } = useAnimations() as AnimationsContext;
  const { setPreventListLoading } = useTarefasList() as TarefasListContext;
  const filterBodyId = useId();

  const isBodyFilterVisible = isVisible(filterBodyId);
  useEffect(() => setPreventListLoading(isBodyFilterVisible), [isBodyFilterVisible]);

  return (
    <aside className="filter">
      <HeaderFilterHeader animatableElementId={filterBodyId} />
      {isBodyFilterVisible && (
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
