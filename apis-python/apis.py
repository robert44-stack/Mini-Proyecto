import requests
import json
from datetime import datetime

# Función para obtener información de un usuario de GitHub
def obtener_usuario_github(usuario):
    print(f'\nBuscando usuario: {usuario}')
    
    try:
        respuesta = requests.get(f'https://api.github.com/users/{usuario}')
        
        if respuesta.status_code == 404:
            print(f'Error: el usuario "{usuario}" no existe')
            return None
        
        datos = respuesta.json()
        
        print('=== INFORMACION DEL USUARIO ===')
        print(f'Nombre: {datos.get("name")}')
        print(f'Usuario: {datos.get("login")}')
        print(f'Seguidores: {datos.get("followers")}')
        print(f'Repositorios publicos: {datos.get("public_repos")}')
        print(f'Ubicacion: {datos.get("location") or "No especificada"}')
        print(f'Perfil: {datos.get("html_url")}')
        
        return datos
        
    except Exception as e:
        print(f'Error al conectar con la API: {e}')
        return None

# Función para obtener repositorios de un usuario
def obtener_repositorios(usuario):
    print(f'\nObteniendo repositorios de: {usuario}')
    
    try:
        respuesta = requests.get(f'https://api.github.com/users/{usuario}/repos')
        repos = respuesta.json()
        
        print('=== REPOSITORIOS ===')
        for repo in repos[:5]:
            print(f'\n  Nombre: {repo["name"]}')
            print(f'  Descripcion: {repo["description"] or "Sin descripcion"}')
            print(f'  Estrellas: {repo["stargazers_count"]}')
            print(f'  URL: {repo["html_url"]}')
        
        return repos
        
    except Exception as e:
        print(f'Error al obtener repositorios: {e}')
        return []

# Función para obtener el clima
def obtener_clima(ciudad):
    print(f'\nObteniendo clima de: {ciudad}')
    
    try:
        respuesta = requests.get(f'https://wttr.in/{ciudad}?format=j1')
        datos = respuesta.json()
        condicion = datos['current_condition'][0]
        
        print('=== CLIMA ACTUAL ===')
        print(f'Ciudad: {ciudad}')
        print(f'Temperatura: {condicion["temp_C"]}C')
        print(f'Sensacion termica: {condicion["FeelsLikeC"]}C')
        print(f'Humedad: {condicion["humidity"]}%')
        print(f'Descripcion: {condicion["weatherDesc"][0]["value"]}')
        
        return condicion
        
    except Exception as e:
        print(f'Error al obtener el clima: {e}')
        return None

# Función para guardar reporte
def guardar_reporte(usuario, repos, clima):
    reporte = {
        'fecha': datetime.now().strftime('%d/%m/%Y %H:%M:%S'),
        'usuario': {
            'nombre': usuario.get('name'),
            'seguidores': usuario.get('followers'),
            'repositorios': usuario.get('public_repos')
        },
        'top_repositorios': [
            {
                'nombre': r['name'],
                'estrellas': r['stargazers_count']
            }
            for r in repos[:3]
        ],
        'clima': {
            'temperatura': f'{clima["temp_C"]}C',
            'descripcion': clima['weatherDesc'][0]['value']
        } if clima else None
    }
    
    with open('reporte.json', 'w') as f:
        json.dump(reporte, f, indent=2)
    
    print('\n=== REPORTE GUARDADO ===')
    print('Se genero el archivo reporte.json')

# Ejecutar todo
usuario = obtener_usuario_github('torvalds')
repos = obtener_repositorios('torvalds')
clima = obtener_clima('Madrid')

if usuario:
    guardar_reporte(usuario, repos, clima)