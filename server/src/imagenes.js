import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const CARPETA = path.join(path.dirname(fileURLToPath(import.meta.url)), '../uploads/libros')

const MAX_BYTES = 700 * 1024
const NOMBRE_VALIDO = /^[a-f0-9]{32}\.(jpg|png|webp)$/

const TIPOS = {
    jpeg: { ext: 'jpg', esReal: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
    png: { ext: 'png', esReal: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
    webp: { ext: 'webp', esReal: (b) => b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP' }
}

const invalida = (mensaje) => Object.assign(new Error(mensaje), { status: 400 })

export async function guardarImagen(dataUrl) {
    const partes = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(String(dataUrl ?? ''))
    if (!partes) throw invalida('La imagen no es válida. Usa una foto JPG, PNG o WEBP.')

    const bytes = Buffer.from(partes[2], 'base64')
    if (bytes.length > MAX_BYTES) throw invalida('La imagen pesa demasiado. Prueba con otra más pequeña.')

    const tipo = TIPOS[partes[1]]
    if (!tipo.esReal(bytes)) throw invalida('El archivo no es una imagen válida.')

    await fs.mkdir(CARPETA, { recursive: true })
    const nombre = `${crypto.randomBytes(16).toString('hex')}.${tipo.ext}`
    await fs.writeFile(path.join(CARPETA, nombre), bytes, { flag: 'wx' })
    return nombre
}

export async function borrarImagen(nombre) {
    if (!NOMBRE_VALIDO.test(String(nombre ?? ''))) return
    try { await fs.unlink(path.join(CARPETA, nombre)) } catch { /* ya no estaba */ }
}

export const rutaImagen = (nombre) => (NOMBRE_VALIDO.test(String(nombre ?? '')) ? path.join(CARPETA, nombre) : null)