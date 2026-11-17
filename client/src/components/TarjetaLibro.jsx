import { Resaltar } from '../utils.jsx'
import PortadaLibro from './PortadaLibro.jsx'


export default function TarjetaLibro({ libro, texto, onAbrir }) {
    const sinCopias = libro.DISPONIBLES === 0
   
    return (
        <article className="tarjeta-libro">
            
            <div className="tarjeta-portada">
                <PortadaLibro libro={libro} lazy />
            </div>

            <div className="tarjeta-cuerpo">
                <span className={`tarjeta-disponibles${sinCopias ? ' sin-copias' : ''}`}>
                    {sinCopias ? 'Sin copias disponibles' : `Disponibles: ${libro.DISPONIBLES} de ${libro.N_COPIA}`}
                </span>

                <h3 className="tarjeta-titulo">
                    <button type="button" className="tarjeta-abrir" onClick={() => onAbrir(libro)}>
                        <Resaltar valor={libro.TITULO} texto={texto} />
                    </button>
                </h3>
                <p className="tarjeta-autor"><Resaltar valor={libro.AUTOR} texto={texto} /></p>

                <dl className="tarjeta-datos">
                    <div>
                        <dt>Género</dt>
                        <dd><Resaltar valor={libro.GENERO} texto={texto} /></dd>
                    </div>
                    <div>
                        <dt>Código de barras</dt>
                        <dd><Resaltar valor={libro.CODIGO_DE_BARRA} texto={texto} /></dd>
                    </div>
                    <div>
                        <dt>CDD</dt>
                        <dd><Resaltar valor={libro.CDD} texto={texto} /></dd>
                    </div>
                </dl>
            </div>
        </article>
    )
}