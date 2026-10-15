import type { z } from "zod";

import { tarefaSchema } from "./tarefa.schema";

export const criarTarefaInputSchema = tarefaSchema.pick({
  titulo: true,
  descricao: true
});

export type CriarTarefaInput = z.infer<typeof criarTarefaInputSchema>;
