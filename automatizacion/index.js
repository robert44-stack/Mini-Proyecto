const fs = require('fs')
const path = require('path')

const carpetaArchivos = './archivos'
const carpetaBackups = './backups'
const carpetaLogs = './logs'

function escribirLog(mensaje) {
  const fecha = new Date().toLocaleString()
  const log = `[${fecha}] ${mensaje}\n`
  fs.appendFileSync(`${carpetaLogs}/registro.txt`, log)
  console.log(log.trim())
}

function hacerBackup() {
  escribirLog('Iniciando backup...')
  const archivos = fs.readdirSync(carpetaArchivos)

  if (archivos.length === 0) {
    escribirLog('No hay archivos para respaldar')
    return
  }

  const fecha = new Date().toISOString().replace(/[:.]/g, '-')
  const carpetaDestino = path.join(carpetaBackups, `backup-${fecha}`)
  fs.mkdirSync(carpetaDestino)

  archivos.forEach(archivo => {
    const origen = path.join(carpetaArchivos, archivo)
    const destino = path.join(carpetaDestino, archivo)
    fs.copyFileSync(origen, destino)
    escribirLog(`Archivo respaldado: ${archivo}`)
  })

  escribirLog(`Backup completado en: ${carpetaDestino}`)
}

function limpiarBackupsAntiguos(diasMaximos) {
  escribirLog(`Limpiando backups de más de ${diasMaximos} días...`)
  const backups = fs.readdirSync(carpetaBackups)
  const ahora = new Date()
  let eliminados = 0

  backups.forEach(backup => {
    const carpeta = path.join(carpetaBackups, backup)
    const stats = fs.statSync(carpeta)
    const diasAntigüedad = (ahora - stats.mtime) / (1000 * 60 * 60 * 24)

    if (diasAntigüedad > diasMaximos) {
      fs.rmSync(carpeta, { recursive: true })
      escribirLog(`Backup eliminado: ${backup}`)
      eliminados++
    }
  })

  if (eliminados === 0) {
    escribirLog('No hay backups antiguos para eliminar')
  } else {
    escribirLog(`Se eliminaron ${eliminados} backups antiguos`)
  }
}

function mostrarResumen() {
  escribirLog('=== RESUMEN ===')
  const archivos = fs.readdirSync(carpetaArchivos)
  escribirLog(`Archivos en carpeta: ${archivos.length}`)
  const backups = fs.readdirSync(carpetaBackups)
  escribirLog(`Backups disponibles: ${backups.length}`)
}

// Función principal que ejecuta todas las tareas
function ejecutarTareas() {
  escribirLog('=== INICIANDO TAREAS AUTOMATIZADAS ===')
  hacerBackup()
  limpiarBackupsAntiguos(7)
  mostrarResumen()
  escribirLog('=== TAREAS COMPLETADAS ===\n')
}

// Ejecutar inmediatamente
ejecutarTareas()

// Programar para ejecutarse cada 30 segundos
const intervalo = 30 * 1000
console.log(`\nTareas programadas cada 30 segundos. Presiona Ctrl+C para detener.\n`)

setInterval(ejecutarTareas, intervalo)