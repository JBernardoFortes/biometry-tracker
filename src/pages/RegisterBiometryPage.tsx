export default function RegisterBiometryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Cadastrar Biometria
      </h1>

      <div className="rounded-xl border border-slate-200 bg-white p-6 max-w-md">
        <p className="text-sm text-slate-500 mb-4">
          Posicione o dedo do aluno no leitor para capturar a biometria.
        </p>

        <button className="w-full px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer">
          Iniciar Captura
        </button>
      </div>
    </div>
  );
}
