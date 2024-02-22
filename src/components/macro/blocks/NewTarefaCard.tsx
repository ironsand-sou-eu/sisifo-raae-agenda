import useProjurisConnector from "../../hooks/connectors/useProjurisConnector";
import FetchingSelect from "../../micro/FetchingSelect";
import { codigoUsuario } from "../../../hardcoded";
import Textarea from "../../micro/Textarea";
import PrazosCard from "../../micro/PrazosCard";
import Button from "../../micro/Button";
import { useAnimations } from "../../hooks/providers/AnimationsProvider";
import AnimatableFetchingSelect from "../../micro/AnimatableFetchingSelect";
import { Marcador, SimpleDocument } from "../../../global";
import { useCreateEntities } from "../../hooks/providers/CreateEntitiesProvider";
import DetailedCardHeader from "./DetailedCardHeader";
import InputText from "../../micro/InputText";
import HeaderButton from "../../micro/HeaderButton";
import { useMemo } from "react";

export default function NewTarefaCard() {
  const {
    newTarefa,
    newTarefaValidation,
    clearNewTarefa,
    createNewTarefa,
    updateNewTarefa,
    setNewTarefaPanelVisibility,
  } = useCreateEntities();
  const { setHidingAnimation } = useAnimations();
  const { endpoints } = useProjurisConnector();

  const {
    tipoTarefa,
    titulo,
    local,
    dataConclusaoPrevista,
    dataLimite,
    descricaoTarefa,
    usuariosResponsaveis,
    gruposResponsaveis,
    marcadorWs,
    tarefaEventoSituacaoWs,
    quadroKanban,
    colunaKanban,
  } = newTarefa ?? {};

  function handleQuadroKanbanChange(newValue: unknown) {
    if (!newValue) {
      setHidingAnimation("newTarefaColunaKanban", () => updateNewTarefa({ quadroKanban: newValue as SimpleDocument }));
    } else {
      updateNewTarefa({ quadroKanban: newValue as SimpleDocument });
    }
  }

  const saveButtonDisabled = useMemo(() => {
    if (newTarefaValidation && newTarefaValidation.ok) return false;
    return true;
  }, [newTarefaValidation]);

  return (
    <section className="card tarefa-card tarefa-detailed-card">
      <DetailedCardHeader
        caption={"Criar nova tarefa"}
        circleColor={"#9d37d3"}
        closeFunction={() => setNewTarefaPanelVisibility({ visible: false })}
        rightDiv={<HeaderButton type="delete" onClick={clearNewTarefa} className="small-button" title="Limpar" />}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.tiposTarefa}
        hasMultiLevelSource={false}
        values={tipoTarefa}
        onChange={newValue => updateNewTarefa({ tipoTarefa: newValue as SimpleDocument })}
        error={newTarefaValidation?.errors.tipoTarefa}
        name="tipo-tarefa"
        label="Tipo"
        isMulti={false}
      />
      <InputText
        label="Título alternativo"
        name="titulo"
        value={titulo}
        onChange={ev => updateNewTarefa({ titulo: ev.target.value })}
        error={newTarefaValidation?.errors.titulo}
      />
      <InputText
        label="Local/Site"
        name="local"
        value={local}
        onChange={ev => updateNewTarefa({ local: ev.target.value })}
        error={newTarefaValidation?.errors.local}
      />
      <PrazosCard
        {...{ dataConclusaoPrevista, dataLimite }}
        dataConclusao={null}
        dateAsNumber={false}
        onChange={updateNewTarefa}
        error={{
          dataConclusaoPrevista: newTarefaValidation?.errors.dataConclusaoPrevista,
          dataLimite: newTarefaValidation?.errors.dataLimite,
        }}
        prazoColorCssVariable=""
      />
      <Textarea
        name="descricao"
        label="Descrição"
        content={descricaoTarefa}
        onChange={ev => updateNewTarefa({ descricaoTarefa: ev.target.value })}
        error={newTarefaValidation?.errors.descricaoTarefa}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.responsaveis}
        hasMultiLevelSource={false}
        values={usuariosResponsaveis}
        onChange={newValue => updateNewTarefa({ usuariosResponsaveis: newValue as SimpleDocument[] })}
        error={newTarefaValidation?.errors.usuariosResponsaveis}
        name="responsaveis"
        label="Responsáveis"
        isMulti={true}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.gruposTrabalho}
        hasMultiLevelSource={false}
        values={gruposResponsaveis}
        onChange={newValue => updateNewTarefa({ gruposResponsaveis: newValue as SimpleDocument[] })}
        error={newTarefaValidation?.errors.gruposResponsaveis}
        name="grupos-trabalho"
        label="Grupos de trabalho"
        isMulti={true}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.marcadores}
        hasMultiLevelSource={false}
        values={marcadorWs}
        onChange={newValue => updateNewTarefa({ marcadorWs: newValue as Marcador[] })}
        error={newTarefaValidation?.errors.marcadorWs}
        filterObject={{ key: "nomeMarcador" }}
        name="marcadores"
        label="Marcadores"
        isMulti={true}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.situacoesTarefa}
        hasMultiLevelSource={false}
        values={tarefaEventoSituacaoWs}
        onChange={newValue => updateNewTarefa({ tarefaEventoSituacaoWs: newValue as SimpleDocument })}
        error={newTarefaValidation?.errors.tarefaEventoSituacaoWs}
        name="situacao"
        label="Situação"
        isMulti={false}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.quadrosKanban(codigoUsuario)}
        hasMultiLevelSource={false}
        values={quadroKanban}
        onChange={handleQuadroKanbanChange}
        error={newTarefaValidation?.errors.quadroKanban}
        name="quadro-kanban"
        label="Quadro kanban"
        isMulti={false}
      />
      <AnimatableFetchingSelect
        condition={!!quadroKanban}
        optionsEndpoint={endpoints.colunasKanban(quadroKanban?.chave)}
        hasMultiLevelSource={false}
        values={colunaKanban}
        onChange={newValue => updateNewTarefa({ colunaKanban: newValue as SimpleDocument })}
        error={newTarefaValidation?.errors.colunaKanban}
        refType="newTarefaColunaKanban"
        name="coluna-kanban"
        label="Coluna kanban"
        isMulti={false}
      />
      <div className="btn-container">
        <Button
          name="criar-nova-tarefa"
          disabled={saveButtonDisabled}
          caption="Criar tarefa nova"
          className="btn save-btn"
          onClick={createNewTarefa}
        />
      </div>
      <footer className="tarefa-card-footer" />
    </section>
  );
}
