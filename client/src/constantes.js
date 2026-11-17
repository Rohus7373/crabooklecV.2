export const ROLES = ['Estudiante', 'Docente', 'Asistente de la educación']

export const CURSOS = [
    '1°A', '1°B', '1°C', '2°A', '2°B', '2°C',
    '3°A', '3°B', '3°C', '4°A', '4°B', '4°C'
]

export const GRUPOS_RANKING = [
    ['', 'Todos'],
    ...CURSOS.map(curso => [curso, curso]),
    ['Docentes', 'Docentes / asistentes de la educación']
]

export const MAX_RESUMEN = 1500

export const IMAGEN_PREDETERMINADA = '/img/predeterminada.png'