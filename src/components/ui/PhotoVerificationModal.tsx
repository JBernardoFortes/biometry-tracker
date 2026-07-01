import type { Foto } from "../../types/index.ts";

interface PhotoVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  fotos?: Foto[];
  turmaNome: string;
  data: string;
}

export default function PhotoVerificationModal({
  isOpen,
  onClose,
  fotos = [],
  turmaNome,
  data,
}: PhotoVerificationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Imagens de verificação — {turmaNome}
            </h2>
            <p className="text-sm text-slate-500">
              Capturadas pela câmera em {data}
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {fotos.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhuma imagem capturada para esta data.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fotos.map((foto) => (
              <div
                key={foto.id}
                className="rounded-lg overflow-hidden border border-slate-200"
              >
                <img
                  src={foto.url}
                  alt={`Captura às ${foto.horario}`}
                  className="w-full h-40 object-cover"
                />
                <div className="px-3 py-2 text-xs text-slate-500 bg-slate-50">
                  Capturada às {foto.horario}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
