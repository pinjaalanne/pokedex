const pokeContainer = document.querySelector('.pokecontainer')
const input = document.querySelector('#search')

let pokeData = []

const fetchData = () => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=121&offset=0')
        .then((res) => res.json())
        .then((data) => {
            const fetches = data.results.map((item) => {
                return fetch(item.url)
                    .then((res) => res.json())
                    .then((data) => {
                        return {
                            id: data.id,
                            name: data.name,
                            img: data.sprites.other['official-artwork'].front_default,
                            types: data.types,
                            height: data.height,
                            weight: data.weight
                        };
                    });
            });
            Promise.all(fetches).then((res) => {
                pokeData = res;
                pokeMons();
            });
        });
}

const pokeMons = (filteredData = pokeData) => {
    const cards = filteredData.map(pokemon => {
        return  `<div class="pokebox">
               <p class="number">#${pokemon.id}</p>
               <div class="pokeboximg">
                 <img class="bulba" src="${pokemon.img}" alt="no img" />
               </div>
               <div class="poketext">
                 <h2 class="pokeboxhead">${pokemon.name}</h2>
                 <p class="pokeboxtext">Height: ${pokemon.height} Weight: ${pokemon.weight}</p>
                 <div class="types">
                ${pokemon.types.map((type) => type.type.name).join('|')}
                 </div>
               </div>
             </div>`;
    }).join('');

    pokeContainer.innerHTML = cards;
}

const searchPokes = () => {
    input.addEventListener("keyup", () => {
        const searchString = input.value.toLowerCase();
        if (searchString) {
            const filteredPokemons = pokeData.filter(pokemon => {
                return pokemon.name.toLowerCase().includes(searchString);
            });
            pokeMons(filteredPokemons);
        } else {
            pokeMons(pokeData);
        }
    });
}

fetchData();
searchPokes();