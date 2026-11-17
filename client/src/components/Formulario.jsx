import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api.js'
import { aviso, exito } from '../dialogos.js'
import { prepararImagen } from '../imagenes.js'
import { IMAGEN_PREDETERMINADA, MAX_RESUMEN } from '../constantes.js'
import ErrorPagina from './ErrorPagina.jsx'

export default function Formulario({ config }) {
    const { id } = useParams()
    const navegar = useNavigate()
    const [datos, setDatos] = useState({})
    const [cargando, setCargando] = useState(Boolean(id))
    const [fallo, setFallo] = useState(false)
    const [imagenNueva, setImagenNueva] = useState(null) 
    const [quitarImagen, setQuitarImagen] = useState(false) 
    const inputImagen = useRef(null)

    useEffect(() => {
        if (!id) return
        let vigente = true
        api(`${config.ruta}/${id}`)
            .then(registro => { if (vigente) { setDatos(registro); setCargando(false) } })
            .catch(() => { if (vigente) { setFallo(true); setCargando(false) } })
        return () => { vigente = false }
    }, [id, config.ruta])

    const guardar = async (e) => {
        e.preventDefault()
        const cuerpo = Object.fromEntries(config.campos.map(([nombre]) => [nombre, datos[nombre] ?? '']))
        if (config.resumen) cuerpo.RESUMEN = datos.RESUMEN ?? ''
        if (config.imagen && imagenNueva) cuerpo.IMAGEN_DATA = imagenNueva
        else if (config.imagen && quitarImagen) cuerpo.QUITAR_IMAGEN = true
        
        try {
            await api(id ? `${config.ruta}/${id}` : config.ruta, { method: id ? 'PUT' : 'POST', body: cuerpo })
            await exito(config.exito.titulo, config.exito.timer, config.exito.texto)
            navegar(config.volver)
        } catch (error) {
            aviso('error', config.errorTitulo, error.message)
        }
    }

    const elegirImagen = async (e) => {
        const archivo = e.target.files[0]
        if (!archivo) return
        try {
            setImagenNueva(await prepararImagen(archivo))
            setQuitarImagen(false)
        } catch (error) {
            aviso('warning', 'No se pudo usar la imagen', error.message)
            e.target.value = ''
        }
    }

    const quitar = () => {
        setImagenNueva(null)
        setQuitarImagen(true)
        if (inputImagen.current) inputImagen.current.value = ''
    }

    const vistaPrevia = imagenNueva ?? (!quitarImagen && datos.IMAGEN ? `/api/imagenes/${datos.IMAGEN}` : null)

    if (fallo) return <ErrorPagina />
    if (cargando) return null

    const contenido = (
        <>
            <div className="rejilla-campos">
                {config.campos.map(([nombre, etiqueta, placeholder, tipo = 'text', extra = {}]) => (
                    <div className="campo" key={nombre}>
                        <label htmlFor={nombre}>{etiqueta}</label>
                        {tipo === 'select' ? (
                            <select
                                id={nombre}
                                name={nombre}
                                required={extra.requerido ?? config.requerido}
                                value={datos[nombre] ?? ''}
                                onChange={e => setDatos({ ...datos, [nombre]: e.target.value })}
                            >
                                <option value="">{placeholder}</option>
                                {extra.opciones.map(opcion => <option key={opcion} value={opcion}>{opcion}</option>)}
                            </select>
                        ) : (
                            <input
                                id={nombre}
                                type={tipo}
                                name={nombre}
                                placeholder={placeholder || undefined}
                                required={extra.requerido ?? config.requerido}
                                value={datos[nombre] ?? ''}
                                onChange={e => setDatos({ ...datos, [nombre]: e.target.value })}
                            />
                        )}
                    </div>
                ))}
            </div>
            {config.resumen && (
                <div className="campo campo-resumen">
                    <label htmlFor="RESUMEN">Resumen del libro</label>
                    <textarea
                        id="RESUMEN"
                        name="RESUMEN"
                        rows={5}
                        maxLength={MAX_RESUMEN}
                        placeholder="ej: había una vez en un pueblo muy lejano..."
                        value={datos.RESUMEN ?? ''}
                        onChange={e => setDatos({ ...datos, RESUMEN: e.target.value })}
                    />
                    <p className="ayuda-campo">{(datos.RESUMEN ?? '').length} de {MAX_RESUMEN} caracteres</p>
                </div>
            )}
            {config.imagen && (
                <div className="campo campo-imagen">
                    <label htmlFor="imagen">Imagen del libro</label>
                    <div className="imagen-contenido">
                        <div className="imagen-vista">
                            {vistaPrevia
                                ? <img src={vistaPrevia} alt="Vista previa de la portada" />
                                : <img src={IMAGEN_PREDETERMINADA} alt="Imagen predeterminada" onError={e => { e.currentTarget.style.display = 'none' }} 
                            />}
                        </div>
                        <div className="imagen-acciones">
                            <input id="imagen" ref={inputImagen} type="file" accept="image/*" onChange={elegirImagen} />
                            {vistaPrevia && (
                                <button type="button" className="btn btn-secondary btn-chico" onClick={quitar}>Quitar imagen</button>
                            )}
                            <p className="ayuda-campo">JPG, PNG o WEBP.</p>
                        </div>
                    </div>
                </div>
            )}
            <div className="acciones-formulario">
                <button type="submit" className="btn btn-primary">{config.boton}</button>
                <Link to={config.volver} className="btn btn-secondary">Cancelar</Link>
            </div>
        </>
    )

    if (config.envoltura) {
        return (
            <div className={config.envoltura}>
                <h1>{config.titulo}</h1>
                <form onSubmit={guardar}>{contenido}</form>
            </div>
        )
    }
    return (
        <form className="form-tarjeta" onSubmit={guardar}>
            <h1>{config.titulo}</h1>
            {contenido}
        </form>
    )
}
