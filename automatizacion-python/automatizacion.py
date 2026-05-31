import os
import shutil
from datetime import datetime

# Carpetas que vamos a usar
carpeta_archivos = './archivos'
carpeta_backups = './backups'
carpeta_logs = './logs'

# Crear carpetas si no existen
os.makedirs(carpeta_archivos, exist_ok=True)
os.makedirs(carpeta_backups, exist_ok=True)
os.makedirs(carpeta_logs, exist_ok=True)

# Crear archivos de prueba
for i in range(1, 4):
    with open(f'{carpeta_archivos}/archivo{i}.txt', 'w') as f:
        f.write(f'Contenido del archivo {i}')

def escribir_log(mensaje):
    fecha = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
    log = f'[{fecha}] {mensaje}'
    print(log)
    with open(f'{carpeta_logs}/registro.txt', 'a') as f:
        f.write(log + '\n')

def hacer_backup():
    escribir_log('Iniciando backup...')
    
    archivos = os.listdir(carpeta_archivos)
    
    if not archivos:
        escribir_log('No hay archivos para respaldar')
        return
    
    fecha = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    carpeta_destino = f'{carpeta_backups}/backup-{fecha}'
    os.makedirs(carpeta_destino)
    
    for archivo in archivos:
        origen = f'{carpeta_archivos}/{archivo}'
        destino = f'{carpeta_destino}/{archivo}'
        shutil.copy2(origen, destino)
        escribir_log(f'Archivo respaldado: {archivo}')
    
    escribir_log(f'Backup completado en: {carpeta_destino}')

def limpiar_backups_antiguos(dias_maximos):
    escribir_log(f'Limpiando backups de mas de {dias_maximos} dias...')
    
    backups = os.listdir(carpeta_backups)
    ahora = datetime.now()
    eliminados = 0
    
    for backup in backups:
        carpeta = f'{carpeta_backups}/{backup}'
        fecha_modificacion = datetime.fromtimestamp(os.path.getmtime(carpeta))
        dias_antiguedad = (ahora - fecha_modificacion).days
        
        if dias_antiguedad > dias_maximos:
            shutil.rmtree(carpeta)
            escribir_log(f'Backup eliminado: {backup}')
            eliminados += 1
    
    if eliminados == 0:
        escribir_log('No hay backups antiguos para eliminar')
    else:
        escribir_log(f'Se eliminaron {eliminados} backups antiguos')

def mostrar_resumen():
    escribir_log('=== RESUMEN ===')
    archivos = os.listdir(carpeta_archivos)
    escribir_log(f'Archivos en carpeta: {len(archivos)}')
    backups = os.listdir(carpeta_backups)
    escribir_log(f'Backups disponibles: {len(backups)}')

# Ejecutar tareas
escribir_log('=== INICIANDO TAREAS AUTOMATIZADAS ===')
hacer_backup()
limpiar_backups_antiguos(7)
mostrar_resumen()
escribir_log('=== TAREAS COMPLETADAS ===')