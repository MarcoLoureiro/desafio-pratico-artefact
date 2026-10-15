import { z } from "zod";

export const tarefaSchema = z.object({
  id: z.uuid(),
  titulo: z.string().trim().min(1, "O título é obrigatório."),
  descricao: z.string().trim().optional(),
  dataCriacao: z.date()
});

export type Tarefa = z.infer<typeof tarefaSchema>;
