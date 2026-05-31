const axios = require('axios')
const fs = require('fs')

// Función para obtener información de un usuario de GitHub
async function obtenerUsuarioGithub(usuario) {
  console.log(`\nBuscando usuario: ${usuario}`)

  try {
    const respuesta = await axios.get(`https://api.github.com/users/${usuario}`)
    const datos = respuesta.data

    console.log('=== INFORMACIÓN DEL USUARIO ===')
    console.log('Nombre:', datos.name)
    console.log('Usuario:', datos.login)
    console.log('Seguidores:', datos.followers)
    console.log('Repositorios públicos:', datos.public_repos)
    console.log('Ubicación:', datos.location || 'No especificada')
    console.log('Perfil:', datos.html_url)

    return datos

  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log(`Error: el usuario "${usuario}" no existe`)
    } else {
      console.log('Error al conectar con la API:', error.message)
    }
    return null
  }
}

// Función para obtener los repositorios de un usuario
async function obtenerRepositorios(usuario) {
  console.log(`\nObteniendo repositorios de: ${usuario}`)

  try {
    const respuesta = await axios.get(`https://api.github.com/users/${usuario}/repos`)
    const repos = respuesta.data

    console.log('=== REPOSITORIOS ===')
    repos.slice(0, 5).forEach(repo => {
      console.log(`\n  Nombre: ${repo.name}`)
      console.log(`  Descripción: ${repo.description || 'Sin descripción'}`)
      console.log(`  Estrellas: ${repo.stargazers_count}`)
      console.log(`  URL: ${repo.html_url}`)
    })

    return repos

  } catch (error) {
    console.log('Error al obtener repositorios:', error.message)
    return []
  }
}

// Función para obtener el clima de una ciudad
async function obtenerClima(ciudad) {
  console.log(`\nObteniendo clima de: ${ciudad}`)

  try {
    const respuesta = await axios.get(
      `https://wttr.in/${ciudad}?format=j1`
    )
    const datos = respuesta.data.current_condition[0]

    console.log('=== CLIMA ACTUAL ===')
    console.log('Ciudad:', ciudad)
    console.log('Temperatura:', datos.temp_C + '°C')
    console.log('Sensación térmica:', datos.FeelsLikeC + '°C')
    console.log('Humedad:', datos.humidity + '%')
    console.log('Descripción:', datos.weatherDesc[0].value)

    return datos

  } catch (error) {
    console.log('Error al obtener el clima:', error.message)
    return null
  }
}

// Función para guardar reporte
function guardarReporte(usuario, repos, clima) {
  const reporte = {
    fecha: new Date().toLocaleString(),
    usuario: {
      nombre: usuario.name,
      seguidores: usuario.followers,
      repositorios: usuario.public_repos
    },
    topRepositorios: repos.slice(0, 3).map(r => ({
      nombre: r.name,
      estrellas: r.stargazers_count
    })),
    clima: clima ? {
      temperatura: clima.temp_C + '°C',
      descripcion: clima.weatherDesc[0].value
    } : null
  }

  fs.writeFileSync('reporte.json', JSON.stringify(reporte, null, 2))
  console.log('\n=== REPORTE GUARDADO ===')
  console.log('Se generó el archivo reporte.json')
}

// Ejecutar todo
async function main() {
  const usuario = await obtenerUsuarioGithub('torvalds')
  const repos = await obtenerRepositorios('torvalds')
  const clima = await obtenerClima('Madrid')

  if (usuario) {
    guardarReporte(usuario, repos, clima)
  }
}

main()