const fs = require('fs')
const args = process.argv.slice(2)
const comando = args[0]

if (!comando) {
  console.log('=== HERRAMIENTA CLI ===')
  console.log('\nUso: node index.js <comando>')
  console.log('\nComandos disponibles:')
  console.log('  saludar <nombre>          Saluda a una persona')
  console.log('  sumar <n1> <n2>           Suma dos números')
  console.log('  fecha                     Muestra la fecha actual')
  console.log('  crear-archivo <nombre>    Crea un archivo de texto')
  console.log('  leer-archivo <nombre>     Lee un archivo de texto')
  console.log('  listar                    Lista los archivos de la carpeta')
  process.exit(0)
}

if (comando === 'saludar') {
  const nombre = args[1]
  if (!nombre) {
    console.log('Error: debes proporcionar un nombre')
    process.exit(1)
  }
  console.log(`Hola ${nombre}, bienvenido a tu primera CLI`)

} else if (comando === 'sumar') {
  const n1 = Number(args[1])
  const n2 = Number(args[2])
  if (isNaN(n1) || isNaN(n2)) {
    console.log('Error: debes proporcionar dos números')
    process.exit(1)
  }
  console.log(`Resultado: ${n1} + ${n2} = ${n1 + n2}`)

} else if (comando === 'fecha') {
  console.log('Fecha actual:', new Date().toLocaleString())

} else if (comando === 'crear-archivo') {
  const nombre = args[1]
  if (!nombre) {
    console.log('Error: debes proporcionar un nombre de archivo')
    process.exit(1)
  }
  const contenido = `Archivo creado el ${new Date().toLocaleString()}`
  fs.writeFileSync(nombre, contenido)
  console.log(`Archivo "${nombre}" creado correctamente`)

} else if (comando === 'leer-archivo') {
  const nombre = args[1]
  if (!nombre) {
    console.log('Error: debes proporcionar un nombre de archivo')
    process.exit(1)
  }
  if (!fs.existsSync(nombre)) {
    console.log(`Error: el archivo "${nombre}" no existe`)
    process.exit(1)
  }
  const contenido = fs.readFileSync(nombre, 'utf8')
  console.log(`Contenido de "${nombre}":`)
  console.log(contenido)

} else if (comando === 'listar') {
  const archivos = fs.readdirSync('.')
  console.log('Archivos en la carpeta actual:')
  archivos.forEach(archivo => {
    console.log(' ', archivo)
  })

} else {
  console.log(`Error: comando "${comando}" no reconocido`)
  process.exit(1)
}