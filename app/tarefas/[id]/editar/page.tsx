import { io } from "next/cache";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import TarefaFormulario from "@/app/components/tarefa-formulario";
import { appRouter } from "@/server/trpc/router";

export const metadata: Metadata = {
  title: "Editar tarefa",
  description: "Edite os dados de uma tarefa"
};

type EditarTarefaPageProps = {
  params: Promise<{ id: string }>;
};

async function ConteudoEdicao({ params }: EditarTarefaPageProps) {
  const { id } = await params;
  await io();

  const caller = appRouter.createCaller({
    req: new Request("http://localhost"),
    resHeaders: new Headers()
  });
  const tarefas = await caller.tarefa.listar();
  const tarefa = tarefas.find((item) => item.id === id);

  if (!tarefa) {
    notFound();
  }

  return (
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
          Editar tarefa
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Atualizar tarefa
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Altere o título ou a descrição e salve as modificações.
        </p>
      </header>

      <TarefaFormulario
        tarefa={{
          id: tarefa.id,
          titulo: tarefa.titulo,
          descricao: tarefa.descricao
        }}
      />
    </div>
  );
}

function CarregandoEdicao() {
  return (
    <div className="mx-auto max-w-2xl" aria-label="Carregando tarefa">
      <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
      <div className="mt-8 h-10 w-64 animate-pulse rounded bg-slate-200" />
      <div className="mt-8 h-80 animate-pulse rounded-2xl bg-white shadow-sm" />
    </div>
  );
}

export default function EditarTarefaPage(props: EditarTarefaPageProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<CarregandoEdicao />}>
        <ConteudoEdicao {...props} />
      </Suspense>
    </main>
  );
}
