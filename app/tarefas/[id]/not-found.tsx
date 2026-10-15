import Link from "next/link";

export default function TarefaNaoEncontrada() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          Tarefa não encontrada
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-950">
          Esta tarefa não está disponível
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Ela pode ter sido excluída ou o endereço informado está incorreto.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Voltar para tarefas
        </Link>
      </div>
    </main>
  );
}
