////////////////////////////////////////////////////////// - UTILITIES - ///////////////////////////////////////////////////////////

const $ = (selector) => document.querySelector(selector)

const urlBase = `http://gateway.marvel.com/v1/public/`
let ts = 1
const publicKey = '54b254b30e4102f6835ccaf9fc8daf8a'
const hash = '84fbd4beafba7037582101c9400db27a'
let offset = `&offset=0`

// paginated 
const btnFirstPage = $('.btn-first-page')
const btnNextPage = $('.btn-next-page')
const btnPrevPage = $('.btn-prev-page')
const btnLastPage = $('.btn-last-page')




/////////////////////////////////////////////////////////////-  URL API - ///////////////////////////////////////
const getMarvel = async (resource, search = '') => {
    if (resource !== 'comics' && resource !== 'characters') {
        console.log('Recurso no válido. Debe ser "comics" o "characters".');
    }
    try {
        let url = `${urlBase}${resource}?ts=${ts}&apikey=${publicKey}&hash=${hash}${offset}`;

        if (search) {
            if (resource === 'comics') {
                url += `&titleStartsWith=${encodeURIComponent(search)}`;
            } else if (resource === 'characters') {
                url += `&nameStartsWith=${encodeURIComponent(search)}`;
            }
        }
        console.log('URL de Marvel:', url);
        const response = await fetch(url);
        console.log('Respuesta de Marvel:', response); 
        const data = await response.json();
        console.log('Marvel Data:', data);
        return data.data.results;
    } catch (error) {
        console.log('error');
    }
}



//////////////////////////////////////////////////////// - PRINTED - ////////////////////////////////////////////

const printComics = async (search) => {
    $('#containerCards').innerHTML = '';
    try {
        const comics = await getMarvel('comics', search)
        for (let comic of comics) {
            const thumbnail = comic.thumbnail;
            const imageURL = `${thumbnail.path}.${thumbnail.extension}`;
            $('#containerCards').innerHTML += `
                <div class="comic-card w-72 h-[420px] ml-6 mb-6 bg-red-800	border-2 border-white rounded-[20px] flex flex-col text-center cursor-pointer hover:shadow-lg hover:shadow-white hover:bg-transparent">
                    <img src="${imageURL}" alt="${comic.title}" class="comic-image w-80 h-80 rounded-[20px]">
                    <a class="pt-6 cursor-pointer hover:text-[#73668E]">${comic.title}</a>
                </div>
            `;
        }
    } catch (error) {
        console.log('error');
    }
}

// printComics()

const printCharacters = async (search) => {
    $('#containerCharacters').innerHTML = ''
    try {
        const characters = await getMarvel('characters', search) 
        console.log(characters);
        for (let character of characters) {
            const thumbnail = character.thumbnail;
            const imageURL = `${thumbnail.path}.${thumbnail.extension}`;
            $('#containerCharacters').innerHTML += `
            <div class="w-72 h-[400px] ml-6 mb-6 border-2 border-white rounded-[20px] flex flex-col text-center cursor-pointer hover:shadow-lg hover:shadow-red-800  hover:bg-white hover:text-[#73668E]">
            <img src="${imageURL}" alt="${character.name}" class="w-80 h-80 rounded-[20px]">
            <a class="pt-6 cursor-pointer">
                ${character.name}</a>
        </div>
            `
        }
    } catch (error) {
        console.log('error ');
    }
}






//////////////////////////////////////////////// - SELECT FOR COMICS AND CHARACTERS - ////////////////////////////////////////////
const showComics = async () => {
    await printComics();
    $('#containerCharacters').style.display = 'none';
    $('#containerCards').style.display = 'flex';
}


const showCharacters = async () => {
    await printCharacters();
    $('#containerCards').style.display = 'none';
    $('#containerCharacters').style.display = 'flex';
}

$('#typeSelect').addEventListener('change', async () => {
    const selectedOption = typeSelect.value;
    if (selectedOption === 'Comics') {
        await showComics();
    } else if (selectedOption === 'Personajes') {
        await showCharacters();
    }
});
showComics()


/////////////////////////////////////////////////////// - SEARCH - ////////////////////////////////////////////////////////////////

$('#searchInput').addEventListener('input', async () => {
    const selectedOption = $('#typeSelect').value.toLowerCase(); 
    const search = $('#searchInput').value.toLowerCase();
    if (selectedOption === 'comics') {
        await printComics(search);
    } else if (selectedOption === 'characters') {
        await printCharacters(search);
    }
});
