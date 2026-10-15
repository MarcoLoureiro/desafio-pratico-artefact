"use client";

import Link from "next/link";

type ErroDaAplicacaoProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ErroDaAplicacao({ retry }: ErroDaAplicacaoProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-600">
          Ocorreu um erro
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-950">
          Não foi possível carregar esta página
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Verifique sua conexão e tente novamente. Se o problema continuar,
          recarregue a aplicação.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={retry}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}
