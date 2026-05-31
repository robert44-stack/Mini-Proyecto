const fs = require('fs')
const { execSync } = require('child_process')

// Leer package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))

function mostrarInfo() {
  console.log('=== INFORMACIÓN DEL PROYECTO ===')
  console.log('Nombre:', packageJson.name)
  console.log('Versión:', packageJson.version)
}

function mostrarDependencias() {
  console.log('\n=== DEPENDENCIAS DE PRODUCCIÓN ===')
  Object.entries(packageJson.dependencies).forEach(([nombre, version]) => {
    console.log(`  ${nombre}: ${version}`)
  })

  console.log('\n=== DEPENDENCIAS DE DESARROLLO ===')
  Object.entries(packageJson.devDependencies).forEach(([nombre, version]) => {
    console.log(`  ${nombre}: ${version}`)
  })
}

function verificarActualizaciones() {
  console.log('\n=== ACTUALIZACIONES DISPONIBLES ===')
  try {
    const resultado = execSync('npm outdated').toString()
    console.log(resultado)
  } catch (error) {
    const salida = error.stdout.toString()
    if (salida) {
      console.log(salida)
    } else {
      console.log('  Todo está actualizado')
    }
  }
}

function verificarVulnerabilidades() {
  console.log('\n=== VULNERABILIDADES ===')
  try {
    execSync('npm audit')
    console.log('  No se encontraron vulnerabilidades')
  } catch (error) {
    console.log(error.stdout.toString())
  }
}

function generarReporte() {
  const fecha = new Date().toLocaleString()
  const reporte = {
    fecha,
    proyecto: packageJson.name,
    version: packageJson.version,
    dependencias: packageJson.dependencies,
    dependenciasDev: packageJson.devDependencies
  }

  fs.writeFileSync('reporte.json', JSON.stringify(reporte, null, 2))
  console.log('\n=== REPORTE GUARDADO ===')
  console.log('  Se generó el archivo reporte.json')
}

// Ejecutar todo
mostrarInfo()
mostrarDependencias()
verificarActualizaciones()
verificarVulnerabilidades()
generarReporte()