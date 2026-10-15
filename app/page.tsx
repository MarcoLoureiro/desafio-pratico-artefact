import { io } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";

import TarefaLista from "./components/tarefa-lista";
import type { TarefaDaLista } from "./lib/tarefas-api";
import { appRouter } from "@/server/trpc/router";

async function TarefasCarregadas() {
  await io();

  const caller = appRouter.createCaller({
    req: new Request("http://localhost"),
    resHeaders: new Headers()
  });
  const tarefasCarregadas = await caller.tarefa.listar();
  const tarefas: TarefaDaLista[] = tarefasCarregadas.map((tarefa) => ({
    ...tarefa,
    dataCriacao: tarefa.dataCriacao.toISOString()
  }));

  return <TarefaLista tarefasIniciais={tarefas} />;
}

function CarregandoTarefas() {
  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-label="Carregando tarefas"
    >
      <div className="h-7 w-44 animate-pulse rounded bg-slate-200" />
      <div className="mt-6 space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-24 animate-pulse rounded-xl bg-slate-100"
          />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
              Gerenciador de tarefas
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Minhas tarefas
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
              Acompanhe suas tarefas e remova o que já não precisa fazer.
            </p>
          </div>
          <Link
            href="/tarefas/nova"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <span className="text-lg leading-none" aria-hidden="true">
              +
            </span>
            Nova tarefa
          </Link>
        </header>

        <Suspense fallback={<CarregandoTarefas />}>
          <TarefasCarregadas />
        </Suspense>
      </div>
    </main>
  );
}
