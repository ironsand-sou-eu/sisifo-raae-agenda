import { z } from "zod";

const simpleDocument = z.object({
  chave: z.number().positive(),
  valor: z.string(),
});

const marcador = z.object({
  codigoMarcador: z.number().positive(),
  nomeMarcador: z.string(),
});

export const displayingAndamento = z.object({
  descricaoAndamento: z.string().optional(),
  dataHoraAndamento: z.date(),
  tipoAndamento: simpleDocument,
  responsaveis: z.array(simpleDocument).nonempty(),
});

export const displayingNewTarefa = z.object({
  descricaoTarefa: z.string().optional(),
  dataConclusaoPrevista: z.date(),
  dataLimite: z.date(),
  usuariosResponsaveis: z.array(simpleDocument),
  gruposResponsaveis: z.array(simpleDocument),
  tipoTarefa: simpleDocument,
  marcadorWs: z.array(marcador),
  tarefaEventoSituacaoWs: simpleDocument,
  titulo: z.string().optional(),
  local: z.string().optional(),
  quadroKanban: simpleDocument,
  colunaKanban: simpleDocument,
});

export const displayingTimesheet = z.object({
  dataHoraApontamento: z.date(),
  descricaoApontamento: z.string().optional(),
  faturar: z.boolean(),
  qtdHoras: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .refine(str => str.trim() !== "00:00", { message: "Não é possível lançar um período vazio." }),
  responsavel: simpleDocument,
  tipoLancamento: simpleDocument,
});

export const errorMap: z.ZodErrorMap = (error, ctx) => {
  if (error.message) return { message: error.message };
  if (!ctx.data || (Array.isArray(ctx.data) && ctx.data.length === 0)) return { message: `Campo obrigatório.` };
  switch (error.code) {
    case z.ZodIssueCode.invalid_type:
      return { message: `O valor deve ser do tipo ${error.expected}, e não ${error.received}.` };

    case z.ZodIssueCode.invalid_string:
      if (error.validation === "regex") return { message: 'O lançamento deve estar no formato "00:00"' };
  }
  return { message: ctx.defaultError };
};

export type DisplayingAndamento = z.infer<typeof displayingAndamento>;
export type DisplayingNewTarefa = z.infer<typeof displayingNewTarefa>;
export type DisplayingTimesheet = z.infer<typeof displayingTimesheet>;
export type SimpleDocument = z.infer<typeof simpleDocument>;
export type Marcador = z.infer<typeof marcador>;
