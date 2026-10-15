import type { Metadata } from "next";
import Link from "next/link";

import TarefaFormulario from "@/app/components/tarefa-formulario";

export const metadata: Metadata = {
  title: "Nova tarefa",
  description: "Cadastre uma nova tarefa"
};

export default function NovaTarefaPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          <span aria-hidden="true">←</span>
          Voltar para tarefas
        </Link>

        <header className="mb-8 mt-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Nova tarefa
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Criar tarefa
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Informe um título e, se quiser, adicione uma descrição.
          </p>
        </header>

        <TarefaFormulario />
      </div>
    </main>
  );
}
