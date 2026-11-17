
import { useEffect, useRef, useState } from 'react'
import PortadaLibro from './PortadaLibro.jsx'

export default function ModalLibro({ libro, onCerrar }) {
    const dialogo = useRef(null)
    const sinCopias = libro.DISPONIBLES === 0

    useEffect(() => {
        if (dialogo.current && !dialogo.current.open) dialogo.current.showModal()
    }, [])

    return (
        <dialog
            ref={dialogo}
            className="modal-libro"
            aria-labelledby="modal-libro-titulo"
            onClose={onCerrar}
            onClick={(e) => {
                if (e.target === e.currentTarget) dialogo.current.close()
            }}
        >
            <div className="modal-libro-contenido">

                <button
                    type="button"
                    className="modal-cerrar"
                    aria-label="Cerrar"
                    onClick={() => dialogo.current.close()}
                >
                    &times;
                </button>

                {/* COLUMNA IZQUIERDA: PORTADA Y DATOS */}
                <div className="modal-columna-izquierda">

                <div className="modal-portada">
                    <PortadaLibro libro={libro} />
                </div>

                    <div className="modal-datos">

                        <span className={`tarjeta-disponibles${sinCopias ? ' sin-copias' : ''}`}>
                            {sinCopias
                                ? 'Sin copias disponibles'
                                : `Disponibles: ${libro.DISPONIBLES} de ${libro.N_COPIA}`}
                        </span>

                        <h2 id="modal-libro-titulo">{libro.TITULO}</h2>

                        <p className="modal-autor">{libro.AUTOR}</p>

                        <dl className="modal-ficha">
                            <div>
                                <dt>Editorial</dt>
                                <dd>{libro.EDITORIAL}</dd>
                            </div>
                            <div>
                                <dt>Género</dt>
                                <dd>{libro.GENERO}</dd>
                            </div>
                            <div>
                                <dt>Código de barras</dt>
                                <dd>{libro.CODIGO_DE_BARRA}</dd>
                            </div>
                            <div>
                                <dt>CDD</dt>
                                <dd>{libro.CDD}</dd>
                            </div>
                            <div>
                                <dt>N° de registro</dt>
                                <dd>{libro.N_REGISTRO}</dd>
                            </div>
                        </dl>

                    </div>
                </div>

                {/* COLUMNA DERECHA: RESUMEN */}
                <div className="modal-columna-derecha">

                    <h3 className="modal-subtitulo">Resumen</h3>

                    {libro.RESUMEN ? (
                        <p className="modal-resumen">{libro.RESUMEN}</p>
                    ) : (
                        <p className="modal-resumen sin-resumen">
                            Este libro todavía no tiene resumen.
                        </p>
                    )}

                </div>

            </div>
        </dialog>
    )
}
