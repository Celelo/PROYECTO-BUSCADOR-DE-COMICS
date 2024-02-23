////////////////////////////////////////////////////////// - UTILITIES - //////////////////////////////////////////

const $ = (selector) => document.querySelector(selector)

const urlBase = `http://gateway.marvel.com/v1/public/`
let ts = 1
const publicKey = '54b254b30e4102f6835ccaf9fc8daf8a'
const hash = '84fbd4beafba7037582101c9400db27a'
let offset = 0; 
let currentPageIndex = 0;

// paginated 
const btnInitPage = $('.btn-init-page')
const btnPrevPage = $('.btn-prev-page')
const btnNextPage = $('.btn-next-page')
const btnEndPage = $('.btn-end-page')

const infoComics = $('#infoComics')
const infoCharacters = $('#infoCharacters')



/////////////////////////////////////////////////////////////-  URL API - ///////////////////////////////////////

const getMarvel = async (resource, search = '') => {
    if (resource !== 'comics' && resource !== 'characters') {
        console.log('Recurso no válido. Debe ser "comics" o "characters".');
    }

    try {
        let url = `${urlBase}${resource}?ts=${ts}&apikey=${publicKey}&hash=${hash}&offset=${offset}`;

        if (search) {
            if (resource === 'comics') {
                url += `&titleStartsWith=${encodeURIComponent(search)}`;
            } else if (resource === 'characters') {
                url += `&nameStartsWith=${encodeURIComponent(search)}`;
            }
        }

        const response = await fetch(url);
        const data = await response.json();
        totalResultsData = data.data.total;

        return data.data.results;
    } catch (error) {
        console.log('error');
    }
}



//////////////////////////////////////////////////////// - PRINTED - ////////////////////////////////////////////

/////////////////////////////////////////////////////////// - INFO COMICS AND CHARACTERS - //////////////////////////////


const printComics = async (search, sortOrder) => {
    $('#containerCards').innerHTML = '';
    try {
        const comics = await getMarvel('comics', search)

        if (sortOrder === 'A-Z') {
            comics.sort((a, b) => a.title.localeCompare(b.title));
        }

        else if (sortOrder === 'Z-A') {
            comics.sort((a, b) => b.title.localeCompare(a.title));
        }

        else if (sortOrder === 'Mas nuevos') {
            comics.sort((a, b) => new Date(b.modified) - new Date(a.modified));
        }

        else if (sortOrder === 'Mas viejos') {
            comics.sort((a, b) => new Date(a.modified) - new Date(b.modified));
        }

        for (let i = 0; i < comics.length; i++) {
            const comic = comics[i];
            const thumbnail = comic.thumbnail;
            const imageURL = `${thumbnail.path}.${thumbnail.extension}`;

            const comicCard = document.createElement('div');
            comicCard.className = "comic-card w-72 h-[420px] ml-6 mb-6 bg-red-800	border-2 border-white rounded-[20px] flex flex-col text-center cursor-pointer hover:shadow-lg hover:shadow-white hover:bg-transparent";
            comicCard.onclick = () => showComicInfo(comic);
            comicCard.innerHTML = `
                <img src="${imageURL}" alt="${comic.title}" class="comic-image w-80 h-80 rounded-[20px]">
                <a class="pt-6 cursor-pointer hover:text-[#73668E]">${comic.title}</a>
            `;
            $('#containerCards').appendChild(comicCard);
        }
    } catch (error) {
        console.log('error');
    }
}

const showComicInfo = async (comic) => {
    const { title, modified, creators, description, characters } = comic;
    const thumbnail = comic.thumbnail;
    const imageURL = `${thumbnail.path}.${thumbnail.extension}`;

    let comicInfoHTML = `
    <button class="btn-back bg-[#73668E]  text-white font-bold py-2 px-4 rounded cursor-pointer hover:shadow-lg hover:shadow-white hover:bg-white hover:text-[#73668E]">Volver atrás</button>

        <div class="flex justify-center items-start py-8 px-4">
        <div class="w-1/2 pr-8">
            <img src="${imageURL}" alt="${title}" class="w-96 h-96">
        </div>
        <div class="w-1/2">
            <h2 class="text-2xl font-bold mb-4">${title}</h2>
            <p class="text-white mb-4">Publicado:</p>
            <p class="text-white mb-4">${modified ? new Date(modified).toLocaleDateString() : 'No encontrado'}</p>
            <p class="text-white mb-4">Guionistas:</p>
            <p class="text-white mb-4">${creators.items.map(creator => creator.name).join(', ')}</p>
            <p class="text-white mb-4">Descripción:</p> 
            <p class="text-white mb-4">${description || 'No disponible'}</p> 
            <p class="text-white mb-4">personajes encontrados:</p> 
            <p class="text-white mb-4">Se encontro ${characters.available} personajes.</p>
        </div>
    </div>
    
    <div class="flex  py-8">
        <div class="grid grid-cols-6 gap-4">`;
    if (characters.available > 0 && characters.items.length > 0) {
        const charactersToShow = characters.items.slice(0, 20);

        for (let character of charactersToShow) {
            // const thumbnail = character.thumbnail;
            // const characterImageURL = thumbnail ? `${thumbnail.path}.${thumbnail.extension}` : 'placeholder.jpg';
            comicInfoHTML += `
            <div class="bg-[#73668E] w-52 h-52 mb-24 mb-20 rounded-lg cursor-pointer hover:shadow-lg hover:shadow-white  hover:text-[#73668E]">
                <img src="${imageURL}" alt="${character.name}" class="w-72 h-72">
                <h3 class="text-center font-semibold">${character.name}</h3>
            </div>`;
        }
    }
    comicInfoHTML += `
        </div>
    </div>`;

    $('#infoComics').innerHTML = comicInfoHTML;
    $('#containerCards').style.display = 'none';
    $('#infoComics').style.display = 'block';

    $('.btn-back').addEventListener('click', () => {
        $('#infoComics').style.display = 'none';
        $('#containerCards').style.display = 'flex';
    });
}





const printCharacters = async (search, sortOrder) => {
    $('#containerCharacters').innerHTML = '';
    try {
        const characters = await getMarvel('characters', search)

        if (sortOrder === 'A-Z') {
            characters.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === 'Z-A') {
            characters.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortOrder === 'Mas nuevos') {
            characters.sort((a, b) => new Date(b.modified) - new Date(a.modified));
        } else if (sortOrder === 'Mas viejos') {
            characters.sort((a, b) => new Date(a.modified) - new Date(b.modified));
        }

        for (let character of characters) {
            const { name, description } = character;
            const thumbnail = character.thumbnail;
            const imageURL = `${thumbnail.path}.${thumbnail.extension}`;

            const characterCard = document.createElement('div');
            characterCard.className = "character-card w-72 h-[400px] ml-6 mb-6 border-2 border-white rounded-[20px] flex flex-col text-center cursor-pointer hover:shadow-lg hover:shadow-red-800  hover:bg-white hover:text-[#73668E]";
            characterCard.onclick = () => showCharacterInfo(character);
            characterCard.innerHTML = `
                <img src="${imageURL}" alt="${name}" class="w-80 h-80 rounded-[20px]">
                <div class="pt-6 cursor-pointer">
                    <h3 class="font-bold">${name}</h3>
                </div>
            `;
            $('#containerCharacters').appendChild(characterCard);
        }
    } catch (error) {
        console.log('error');
    }
}




const showCharacterInfo = async (character) => {
    const { name, description, thumbnail, comics } = character;
    const imageURL = `${thumbnail.path}.${thumbnail.extension}`;

    let comicInfoHTML = `
    <button class="btn-back bg-[#73668E]  text-white font-bold py-2 px-4 rounded cursor-pointer hover:shadow-lg hover:shadow-white hover:bg-white hover:text-[#73668E]">Volver atrás</button>

        <div class="flex justify-center items-start py-8 px-4">
        <div class="w-1/2 pr-8">
            <img src="${imageURL}" alt="${name}" class="w-96 h-96">
        </div>
        <div class="w-1/2">
            <h2 class="text-2xl font-bold mb-4">${name}</h2>
            <p class="text-white mb-4">Descripción:</p> 
            <p class="text-white mb-4">${description || 'No disponible'}</p> 
        </div>
    </div>
    
    <div class="flex  py-8">
        <div class="grid grid-cols-6 gap-4">`;

    if (comics.available > 0 && comics.items.length > 0) {
        const comicsToShow = comics.items.slice(0, 20);

        for (let comic of comicsToShow) { 
            const thumbnail = character.thumbnail;
            const imageURL = `${thumbnail.path}.${thumbnail.extension}`;
            comicInfoHTML += `
            <div class="bg-[#73668E] w-52 h-52 mb-28 rounded-lg cursor-pointer hover:shadow-lg hover:shadow-white  hover:text-[#73668E]">
                <img src="${imageURL}" alt="${comic.name}" class="w-72 h-72">
                <h3 class="text-center font-semibold">${comic.name}</h3> 
            </div>`;
        }
    } else {
        comicInfoHTML += `<p class="text-white text-center">No se encontraron cómics.</p>`;
    }

    comicInfoHTML += `
        </div>
    </div>`;

    $('#infoCharacters').innerHTML = comicInfoHTML;
    $('#containerCharacters').style.display = 'none';
    $('#infoCharacters').style.display = 'block';

    $('.btn-back').addEventListener('click', () => {
        $('#infoCharacters').style.display = 'none';
        $('#containerCharacters').style.display = 'flex';
    });
}





//////////////////////////////////////////////// - SELECT FOR COMICS AND CHARACTERS - ////////////////////////////////////////////
const showComics = async () => {
    await printComics();
    $('#containerCharacters').style.display = 'none';
    $('#infoCharacters').style.display = 'none'
    $('#containerCards').style.display = 'flex';
}

const showCharacters = async () => {
    await printCharacters();
    $('#containerCards').style.display = 'none';
    $('#infoComics').style.display = 'none';
    $('#containerCharacters').style.display = 'flex';
}

$("#typeSelect").addEventListener("change", async () => {
    const selectedOption = typeSelect.value;
    if (selectedOption === "Comics") {
        await showComics();
    } else if (selectedOption === "characters") {
        await showCharacters();
    }
});


/////////////////////////////////////////////////////// - SEARCH - //////////////////////////////////////////

$('#searchInput').addEventListener('input', async () => {
    const selectedOption = $('#typeSelect').value.toLowerCase();
    const search = $('#searchInput').value.toLowerCase();
    if (selectedOption === 'comics') {
        await printComics(search);
    } else if (selectedOption === 'characters') {
        await printCharacters(search);
    }
});



///////////////////////////////////////////////////////////////// - FILTER - /////////////////////////////////////////////

$('#filtersSelect').addEventListener('change', async () => {
    const selectedOption = $('#filtersSelect').value;
    const selectedType = $('#typeSelect').value.toLowerCase();

    const search = $('#searchInput').value.toLowerCase();

    if (selectedType === 'comics') {
        await printComics(search, selectedOption);
    } else if (selectedType === 'characters') {
        await printCharacters(search, selectedOption);
    }
});

showComics()



////////////////////////////////////////////////////////// - PAGINATED - ////////////////////////////////////////////////

const handlePagination = async () => {
    const selectedOption = $('#typeSelect').value.toLowerCase();
    const search = $('#searchInput').value.toLowerCase();

    if (selectedOption === 'comics') {
        await printComics(search);
    } else if (selectedOption === 'characters') {
        await printCharacters(search);
    }
}

btnInitPage.addEventListener('click', async () => {
    currentPageIndex = 0; 
    offset = 0; 
    await handlePagination(); 
})

btnPrevPage.addEventListener('click', async () => {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        offset -= 20;
        await handlePagination();
    }
});

btnNextPage.addEventListener('click', async () => {
    currentPageIndex++;
    offset += 20;
    await handlePagination();
});

btnEndPage.addEventListener('click', async () => {
    const totalResults = totalResultsData;
    const totalPages = Math.ceil(totalResults / 20);
    currentPageIndex = totalPages - 1;
    offset = currentPageIndex * 20;

    await handlePagination();
});


/////////////////////////////////////////////////////////// - INFO COMICS AND CHARACTERS - //////////////////////////////



