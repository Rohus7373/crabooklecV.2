export async function prepararImagen(archivo) {
    if (!archivo.type.startsWith('image/')) throw new Error('El archivo elegido no es una imagen.')

    let imagen
    try {
        imagen = await createImageBitmap(archivo)
    } catch {
        throw new Error('No se pudo leer esa imagen. Prueba con una foto JPG, PNG o WEBP.')
    }

    const escala = Math.min(1, 800 / Math.max(imagen.width, imagen.height))
    const ancho = Math.round(imagen.width * escala)
    const alto = Math.round(imagen.height * escala)

    const lienzo = document.createElement('canvas')
    lienzo.width = ancho
    lienzo.height = alto
    const contexto = lienzo.getContext('2d')
    contexto.fillStyle = '#fff' 
    contexto.fillRect(0, 0, ancho, alto)
    contexto.drawImage(imagen, 0, 0, ancho, alto)
    imagen.close?.()

    for (const calidad of [0.85, 0.7, 0.55]) {
        const url = lienzo.toDataURL('image/jpeg', calidad)
        if (url.length < 600000) return url
    }
    throw new Error('La imagen pesa demasiado. Prueba con otra.')
}