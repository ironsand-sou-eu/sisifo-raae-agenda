import { SelectValue } from "../micro/Select";
import { Marcador, SimpleDocument } from "./useProjurisConnector";

export default function useProjurisAdapter() {
  type InsertValueLabelParams = SimpleDocument | SimpleDocument[] | Marcador | Marcador[];

  function insertValueLabel(projurisSimpleDocument?: InsertValueLabelParams): SelectValue[] {
    if (!projurisSimpleDocument) return [];
    const projurisSimpleDocumentArray = Array.isArray(projurisSimpleDocument)
      ? projurisSimpleDocument
      : [projurisSimpleDocument];
    return projurisSimpleDocumentArray.map(obj => {
      const label = "codigoMarcador" in obj ? obj.nomeMarcador : obj.valor;
      const value = "codigoMarcador" in obj ? obj.codigoMarcador : obj.chave;
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
