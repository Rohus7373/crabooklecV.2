import { useState } from 'react'
import { IMAGEN_PREDETERMINADA } from '../constantes.js'

export default function PortadaLibro({ libro, lazy = false }) {
    const propia = libro.IMAGEN ? `/api/imagenes/${libro.IMAGEN}` : null
    const [falloPropia, setFalloPropia] = useState(false)
    const [falloPredeterminada, setFalloPredeterminada] = useState(false)

    if (propia && !falloPropia) {
        return (
            <img
                src={propia}
                alt={`Portada de ${libro.TITULO}`}
                loading={lazy ? 'lazy' : undefined}
                onError={() => setFalloPropia(true)}
            />
        )
    }

    if (!falloPredeterminada) {
        return (
            <img
                src={IMAGEN_PREDETERMINADA}
                alt="Sin portada"
                loading={lazy ? 'lazy' : undefined}
                onError={() => setFalloPredeterminada(true)}
            />
        )
    }

    const inicial = String(libro.TITULO ?? '').trim().charAt(0).toUpperCase()
    return <span className="portada-vacia" aria-hidden="true">{inicial}</span>
}