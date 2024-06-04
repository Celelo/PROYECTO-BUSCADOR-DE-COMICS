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





// imprime los comics
const printComics = async (search, sortOrder) => {
    const comics = await getMarvel('comics', search);


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



    $('#containerCards').innerHTML = ''; 
    comics.forEach(comic => {
        const thumbnail = comic.thumbnail;
        const imageURL = `${thumbnail.path}.${thumbnail.extension}`;
        $('#containerCards').innerHTML += `
    <div onclick="showComicDetails(${comic.id})" class="comic-card w-72 h-[420px] ml-6 mb-6 bg-red-800	border-2 border-white rounded-[20px] flex flex-col text-center cursor-pointer hover:shadow-lg hover:shadow-white hover:bg-transparent">
        <img src="${imageURL}" alt="${comic.title}" class="comic-image w-80 h-80 rounded-[20px]">
        <a class="pt-6 cursor-pointer hover:text-[#73668E]">${comic.title}</a>
    </div>
`;

    });
}


// otener imagenes de los personajes (de los comics)
const getCharactersFromURI = async (uri) => {
    try {
        const url = `${uri}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data.data.results)
        return data.data.results;
    } catch (error) {
        console.error('Error fetching characters:', error);
    }
}




// comic information
const showComicDetails = async (comicId) => {
    try {
        const comic = await getMarvel(`comics/${comicId}`);
        const [comicDetail] = comic;
        const { title, thumbnail, modified, creators, description, characters } = comicDetail;

        const imageURL = `${thumbnail.path}.${thumbnail.extension}`;

        $('#infoComics').innerHTML = `
            <button class="btn-back bg-[#73668E] h-16 ml-20 text-white font-bold py-2 px-4 rounded cursor-pointer hover:shadow-lg hover:shadow-white hover:bg-white hover:text-[#73668E]">Volver atrás</button>
            <div class="mt-20">
                <img src="${imageURL}" alt="${title}" class="w-96 h-96">
            </div>
            <div class="w-full pl-4 mt-20 md:w-1/2">
                <h2 class="text-2xl font-bold mb-4">${title}</h2>
                <p class="text-white mb-4">Publicado: ${modified ? new Date(modified).toLocaleDateString() : 'No encontrado'}</p>
                <p class="text-white mb-4">Guionistas: ${creators.items.map(creator => creator.name).join(', ')}</p>
                <p class="text-white mb-4">Descripción: ${description}</p>
                <p class="text-white mb-4">Personajes encontrados: Se encontraron ${characters.available} personajes.</p>
            </div>
        `;


        // imprimir el resultado de personajes
        const relatedCharacters = await getCharactersFromURI(comicDetail.characters.collectionURI);

        $('#characterList').innerHTML = '';
        relatedCharacters.forEach(character => {
            const { name, thumbnail } = character;
            const characterImageURL = `${thumbnail.path}.${thumbnail.extension}`;
            $('#characterList').innerHTML += `
                <div class="mt-9 rounded-lg cursor-pointer hover:shadow-lg hover:shadow-white hover:bg-white hover:text-[#73668E]">
                    <img src="${characterImageURL}" alt="${name}" class="w-64 h-56">
                    <h3 class="text-center font-semibold mb-2">${name}</h3>
                </div>
            `;
        });



        $('#containerCards').style.display = 'none';
        $('#infoComics').style.display = 'flex';
        $('#characterList').style.display = 'grid';

        $('.btn-back').addEventListener('click', () => {
            $('#infoComics').style.display = 'none';
            $('#containerCards').style.display = 'flex';
            $('#characterList').style.display = 'none';
        });
    } catch (error) {
        console.error(error);
    }
}








// imprime los personajes
const printCharacters = async (search, sortOrder) => {
    const characters = await getMarvel('characters', search);


    if (sortOrder === 'A-Z') {
        characters.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'Z-A') {
        characters.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOrder === 'Mas nuevos') {
        characters.sort((a, b) => new Date(b.modified) - new Date(a.modified));
    } else if (sortOrder === 'Mas viejos') {
        characters.sort((a, b) => new Date(a.modified) - new Date(b.modified));
    }



    $('#containerCharacters').innerHTML = '' 
    characters.forEach(character => {
        const thumbnail = character.thumbnail;
            const imageURL = `${thumbnail.path}.${thumbnail.extension}`;
        $('#containerCharacters').innerHTML += `
        <div onclick="showCharacterDetails(${character.id})" class="w-72 h-[400px] ml-6 mb-6 border-2 border-white rounded-[20px] flex flex-col text-center cursor-pointer hover:shadow-lg hover:shadow-red-800  hover:bg-white hover:text-[#73668E]">
            <img src="${imageURL}" alt="${character.name}" class="w-80 h-80 rounded-[20px]">
            <a class="pt-6 cursor-pointer">
                ${character.name}</a>
        </div>
    `;

    });
}


const getComicsFromURI = async (uri, offset = 0) => {
    try {
        const url = `${uri}?ts=${ts}&apikey=${publicKey}&hash=${hash}&offset=${offset}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.data.results;
    } catch (error) {
        console.error('Error fetching comics:', error);
    }
}





// character information
let comicsOffset = 0;
let totalComics = 0;

const showCharacterDetails = async (characterId) => {
    try {
        const characters = await getMarvel(`characters/${characterId}`);
        const [characterDetail] = characters;
        const { name, thumbnail, description, comics } = characterDetail;

        totalComics = comics.available;
        comicsOffset = 0; // Reset offset for new character

        const imageURL = `${thumbnail.path}.${thumbnail.extension}`;

        $('#infoCharacters').innerHTML = `
            <button class="btn-back bg-[#73668E] h-16 ml-20 text-white font-bold py-2 px-4 rounded cursor-pointer hover:shadow-lg hover:shadow-white hover:bg-white hover:text-[#73668E]">Volver atrás</button>
            <div class="flex flex-col md:flex-row justify-center items-start py-8 px-4">
                <div class="w-full md:w-1/2 pr-8 flex justify-center">
                    <img src="${imageURL}" alt="${name}" class="w-96 h-96">
                </div>
                <div class="w-full md:w-1/2">
                    <h2 class="text-2xl font-bold mb-4">${name}</h2>
                    <p class="text-white mb-4">Descripción: ${description || 'No disponible'}</p> 
                    <p class="text-white mb-4">Comics encontrados: Se encontraron ${comics.available} comics.</p>
                </div>
            </div>
        `;

        await loadComics(characterDetail.comics.collectionURI, comicsOffset);

        $('#containerCharacters').style.display = 'none';
        $('#infoCharacters').style.display = 'flex';
        $('#comicList').style.display = 'grid';

        $('.btn-back').addEventListener('click', () => {
            $('#infoCharacters').style.display = 'none';
            $('#containerCharacters').style.display = 'flex';
            $('#comicList').style.display = 'none';
            document.querySelector('.pagination-controls').style.display = 'none';
        });

        document.querySelector('.btn-prev-page').addEventListener('click', async () => {
            if (comicsOffset > 0) {
                comicsOffset -= 20;
                await loadComics(characterDetail.comics.collectionURI, comicsOffset);
            }
        });

        document.querySelector('.btn-next-page').addEventListener('click', async () => {
            if (comicsOffset + 20 < totalComics) {
                comicsOffset += 20;
                await loadComics(characterDetail.comics.collectionURI, comicsOffset);
            }
        });

        document.querySelector('.pagination-controls').style.display = 'flex';
    } catch (error) {
        console.error(error);
    }
};

const loadComics = async (uri, offset) => {
    const relatedComics = await getComicsFromURI(uri, offset);

    $('#comicList').innerHTML = '';
    relatedComics.forEach(comic => {
        const { title, thumbnail } = comic;
        const comicImageURL = `${thumbnail.path}.${thumbnail.extension}`;
        $('#comicList').innerHTML += `
            <div class="mt-9 w-64 rounded-lg cursor-pointer hover:shadow-lg hover:shadow-white hover:bg-white hover:text-[#73668E]">
                <img src="${comicImageURL}" alt="${title}" class="w-64 h-56">
                <h3 class="text-center font-semibold mb-2">${title}</h3>
            </div>
        `;
    });
};







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
    paintCharactersResults(comicId)
})

btnPrevPage.addEventListener('click', async () => {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        offset -= 20;
        await handlePagination();
        paintCharactersResults(comicId)
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




