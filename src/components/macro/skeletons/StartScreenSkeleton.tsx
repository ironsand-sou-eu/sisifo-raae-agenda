import TarefaSmallCardSkeleton from "./TarefaSmallCardSkeleton";

export default function StartScreenSkeleton() {
  return (
    <>
      {[1, 2, 3].map(key => (
        <TarefaSmallCardSkeleton key={key} />
      ))}
    </>
  );
}
