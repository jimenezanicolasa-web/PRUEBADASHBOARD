export type Refaccion = {
  codigo: string
  nombre: string
  categoria: string
  equipo: string
  ubicacion: string
  stock: number
  minimo: number
  unidad: string
}

export const REFACCIONES: Refaccion[] = [
  { codigo: 'ROD-6205', nombre: 'Rodamiento 6205-2RS', categoria: 'Mecánica', equipo: 'Línea 1-3', ubicacion: 'A-01-03', stock: 24, minimo: 10, unidad: 'pza' },
  { codigo: 'ROD-6308', nombre: 'Rodamiento 6308-ZZ', categoria: 'Mecánica', equipo: 'Camas', ubicacion: 'A-01-05', stock: 6, minimo: 8, unidad: 'pza' },
  { codigo: 'BAN-B42', nombre: 'Banda en V B-42', categoria: 'Mecánica', equipo: 'Línea 2', ubicacion: 'A-02-01', stock: 12, minimo: 6, unidad: 'pza' },
  { codigo: 'BAN-TIM-HTD', nombre: 'Banda dentada HTD 8M-1200', categoria: 'Mecánica', equipo: 'Volpack', ubicacion: 'A-02-04', stock: 3, minimo: 4, unidad: 'pza' },
  { codigo: 'CAD-40', nombre: 'Cadena de rodillos ANSI 40', categoria: 'Mecánica', equipo: 'Línea 1', ubicacion: 'A-03-02', stock: 15, minimo: 5, unidad: 'm' },
  { codigo: 'RES-SELL-V', nombre: 'Resistencia de sellado vertical 800 W', categoria: 'Térmica', equipo: 'Volpack', ubicacion: 'B-01-01', stock: 8, minimo: 6, unidad: 'pza' },
  { codigo: 'RES-SELL-H', nombre: 'Resistencia de sellado horizontal 1200 W', categoria: 'Térmica', equipo: 'Volpack', ubicacion: 'B-01-02', stock: 2, minimo: 4, unidad: 'pza' },
  { codigo: 'TC-J-200', nombre: 'Termopar tipo J 200 mm', categoria: 'Térmica', equipo: 'Autoclaves', ubicacion: 'B-02-03', stock: 10, minimo: 5, unidad: 'pza' },
  { codigo: 'RTD-PT100', nombre: 'Sensor RTD PT100 4-20 mA', categoria: 'Térmica', equipo: 'Autoclaves', ubicacion: 'B-02-05', stock: 4, minimo: 3, unidad: 'pza' },
  { codigo: 'EMP-AUT-01', nombre: 'Empaque de puerta autoclave silicón', categoria: 'Hidráulica', equipo: 'Autoclaves', ubicacion: 'C-01-01', stock: 3, minimo: 4, unidad: 'pza' },
  { codigo: 'VAL-SEG-AUT', nombre: 'Válvula de seguridad 3 bar', categoria: 'Hidráulica', equipo: 'Autoclaves', ubicacion: 'C-01-04', stock: 5, minimo: 2, unidad: 'pza' },
  { codigo: 'SOL-5/2-24', nombre: 'Electroválvula 5/2 24 VDC 1/4"', categoria: 'Neumática', equipo: 'General', ubicacion: 'C-02-02', stock: 9, minimo: 6, unidad: 'pza' },
  { codigo: 'CIL-32-100', nombre: 'Cilindro neumático Ø32 x 100 mm', categoria: 'Neumática', equipo: 'Volpack', ubicacion: 'C-02-06', stock: 4, minimo: 2, unidad: 'pza' },
  { codigo: 'FRL-1/2', nombre: 'Unidad FRL 1/2" con manómetro', categoria: 'Neumática', equipo: 'General', ubicacion: 'C-03-01', stock: 2, minimo: 2, unidad: 'pza' },
  { codigo: 'MAN-8MM', nombre: 'Manguera poliuretano 8 mm', categoria: 'Neumática', equipo: 'General', ubicacion: 'C-03-04', stock: 80, minimo: 30, unidad: 'm' },
  { codigo: 'CON-25A', nombre: 'Contactor 25 A bobina 24 VAC', categoria: 'Eléctrica', equipo: 'General', ubicacion: 'D-01-01', stock: 7, minimo: 4, unidad: 'pza' },
  { codigo: 'REL-TER-10', nombre: 'Relevador térmico 7-10 A', categoria: 'Eléctrica', equipo: 'Camas', ubicacion: 'D-01-03', stock: 3, minimo: 3, unidad: 'pza' },
  { codigo: 'FUS-10A', nombre: 'Fusible cerámico 10 A 10x38', categoria: 'Eléctrica', equipo: 'General', ubicacion: 'D-01-06', stock: 40, minimo: 20, unidad: 'pza' },
  { codigo: 'MOT-1HP', nombre: 'Motor trifásico 1 HP 1800 RPM', categoria: 'Eléctrica', equipo: 'Línea 3', ubicacion: 'D-02-01', stock: 1, minimo: 1, unidad: 'pza' },
  { codigo: 'SEN-IND-M18', nombre: 'Sensor inductivo M18 PNP', categoria: 'PLC / Control', equipo: 'Líneas', ubicacion: 'E-01-02', stock: 11, minimo: 6, unidad: 'pza' },
  { codigo: 'SEN-FOT-RF', nombre: 'Fotocelda retrorreflectiva PNP', categoria: 'PLC / Control', equipo: 'Volpack', ubicacion: 'E-01-04', stock: 5, minimo: 4, unidad: 'pza' },
  { codigo: 'SEN-REG-MAR', nombre: 'Sensor de registro de marca (color)', categoria: 'PLC / Control', equipo: 'Volpack', ubicacion: 'E-01-05', stock: 1, minimo: 2, unidad: 'pza' },
  { codigo: 'PLC-DI16', nombre: 'Módulo PLC 16 entradas digitales', categoria: 'PLC / Control', equipo: 'Líneas', ubicacion: 'E-02-01', stock: 2, minimo: 1, unidad: 'pza' },
  { codigo: 'VFD-2HP', nombre: 'Variador de frecuencia 2 HP 220 V', categoria: 'PLC / Control', equipo: 'Camas', ubicacion: 'E-02-03', stock: 1, minimo: 1, unidad: 'pza' },
  { codigo: 'GRA-EP2', nombre: 'Grasa grado alimenticio EP2', categoria: 'Lubricación', equipo: 'General', ubicacion: 'F-01-01', stock: 6, minimo: 4, unidad: 'cartucho' },
  { codigo: 'ACE-ISO68', nombre: 'Aceite hidráulico ISO 68', categoria: 'Lubricación', equipo: 'General', ubicacion: 'F-01-03', stock: 3, minimo: 2, unidad: 'cubeta' },
  { codigo: 'ACE-CAD-H1', nombre: 'Lubricante de cadena H1', categoria: 'Lubricación', equipo: 'Líneas', ubicacion: 'F-01-05', stock: 1, minimo: 3, unidad: 'lata' },
]

export const CATEGORIAS = Array.from(new Set(REFACCIONES.map((r) => r.categoria)))
