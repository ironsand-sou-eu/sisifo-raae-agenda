import { SelectValue } from "../micro/FetchingSelect";
import { Marcador, SimpleDocument, SituacaoTarefa } from "./useProjurisConnector";

export type InsertValueLabelParams = Prettify<SimpleDocument | Marcador | SituacaoTarefa>;

export default function useProjurisAdapter() {
  function insertValueLabel(projurisEntities?: InsertValueLabelParams | InsertValueLabelParams[]): SelectValue[] {
    if (!projurisEntities) return [];
    const projurisEntitiesArray = Array.isArray(projurisEntities) ? projurisEntities : [projurisEntities];
    return projurisEntitiesArray.map(obj => {
      let value, label;
      if ("codigoMarcador" in obj) {
        label = obj.nomeMarcador;
        value = obj.codigoMarcador;
      } else if ("codigoTarefaTipo" in obj) {
        label = obj.nomeTipoTarefa;
        value = obj.codigoTarefaTipo;
      } else {
        label = obj.valor;
        value = obj.chave;
      }
      return {
        ...obj,
        value,
        label,
      };
    });
  }

  function removeValueLabel(object: any): object {
    if (!object) return object;
    if (Array.isArray(object)) return object.map(obj => removeValueLabel(obj));
    const { value, label, ...others } = object;
    return others;
  }

  return { insertValueLabel, removeValueLabel };
}
