// UTILITIES

const $ = (selector) => document.querySelector(selector)

const urlBase = `http://gateway.marvel.com/v1/public/`
let ts = 1
const publicKey = '54b254b30e4102f6835ccaf9fc8daf8a'
const hash = '84fbd4beafba7037582101c9400db27a'

const getMarvel = async (resource) => {
    if (resource !== 'comics' && resource !== 'characters') {
        console.log('Recurso no válido. Debe ser "comics" o "characters".')
    }
    try {
        let url = `${urlBase}${resource}?ts=${ts}&apikey=${publicKey}&hash=${hash}`
        const response = await fetch(url)
        const data = await response.json()
        console.log(data)
        return data.data.results
    } catch (error) {
        
        console.log(error)
    }
}
