import { useId, useMemo } from "react";
import useProjurisConnector from "../../hooks/connectors/useProjurisConnector";
import FetchingSelect from "../../micro/FetchingSelect";
import Textarea from "../../micro/Textarea";
import PrazosCard from "../../micro/PrazosCard";
import Button from "../../micro/Button";
import { Marcador, SimpleDocument } from "../../../global";
import { CreateEntitiesContext, useCreateEntities } from "../../hooks/providers/CreateEntitiesProvider";
import DetailedCardHeader from "./DetailedCardHeader";
import InputText from "../../micro/InputText";
import HeaderButton from "../../micro/HeaderButton";
import AnimationContainer from "../../micro/AnimationContainer";
import { AnimationsContext, useAnimations } from "../../hooks/providers/AnimationsProvider";

export default function NewTarefaCard() {
  const { endpoints } = useProjurisConnector();
  const colunaKanbanId = useId();
  const { toggleVisibility } = useAnimations() as AnimationsContext;
  const {
    newTarefa,
    newTarefaValidation,
    clearNewTarefa,
    createNewTarefa,
    updateNewTarefa,
    setNewTarefaPanelVisibility,
  } = useCreateEntities() as CreateEntitiesContext;

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
    if (!newValue) toggleVisibility(colunaKanbanId, "hide");
    else toggleVisibility(colunaKanbanId, "show");
    updateNewTarefa({ quadroKanban: newValue as SimpleDocument });
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
        optionsEndpoint={endpoints.tarefa.consultarTipos}
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
        startRetracted={true}
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
      <InputText
        label="Local/Site"
        name="local"
        value={local}
        onChange={ev => updateNewTarefa({ local: ev.target.value })}
        error={newTarefaValidation?.errors.local}
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
        optionsEndpoint={endpoints.tarefa.consultarSituacoes}
        hasMultiLevelSource={false}
        values={tarefaEventoSituacaoWs}
        onChange={newValue => updateNewTarefa({ tarefaEventoSituacaoWs: newValue as SimpleDocument })}
        error={newTarefaValidation?.errors.tarefaEventoSituacaoWs}
        name="situacao"
        label="Situação"
        isMulti={false}
      />
      <FetchingSelect
        optionsEndpoint={endpoints.kanban.consultarQuadros}
        hasMultiLevelSource={false}
        values={quadroKanban}
        onChange={handleQuadroKanbanChange}
        error={newTarefaValidation?.errors.quadroKanban}
        name="quadro-kanban"
        label="Quadro kanban"
        isMulti={false}
      />
      {quadroKanban && (
        <AnimationContainer
          id={colunaKanbanId}
          displayingInlineStyle={{ animation: "drop 500ms normal ease-in-out" }}
          hidingInlineStyle={{ animation: "pickup 500ms normal ease-in-out" }}
        >
          <FetchingSelect
            optionsEndpoint={endpoints.kanban.consultarColunasDeUmQuadro(quadroKanban?.chave)}
            hasMultiLevelSource={false}
            values={colunaKanban}
            onChange={newValue => updateNewTarefa({ colunaKanban: newValue as SimpleDocument })}
            error={newTarefaValidation?.errors.colunaKanban}
            name="coluna-kanban"
            label="Coluna kanban"
            isMulti={false}
          />
        </AnimationContainer>
      )}
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
