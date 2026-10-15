import { z } from "zod";

export const tarefaSchema = z.object({
  id: z.uuid("O identificador da tarefa deve ser um UUID válido."),
  titulo: z
    .string("O título é obrigatório.")
    .trim()
    .min(1, "O título é obrigatório."),
  descricao: z.string("A descrição deve ser um texto.").trim().optional(),
  dataCriacao: z.date("A data de criação deve ser válida.")
});

export type Tarefa = z.infer<typeof tarefaSchema>;
