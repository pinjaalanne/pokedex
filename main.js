const pokeContainer = document.querySelector('.pokecontainer')

let pokeData = []

const fetchData = async () => { await
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
            console.log(pokeData);
    });
    });
}

const pokeMons = () => {
   const cards = pokeData.map(pokemon => {
    console.log(pokemon.types);
    return  `<div class="pokebox">
           <p class="number">#${pokemon.id}</p>
           <div class="pokeboximg">
             <img class="bulba" src="${pokemon.img}" alt="no img" />
           </div>
           <div class="poketext">
             <h2 class="pokeboxhead">${pokemon.name}</h2>
             <p class="pokeboxtext">Height: ${pokemon.height} Weight: ${pokemon.weight}</p>
             <div class="types">
            ${pokemon.types.map((type) => getType(type)).join('|')}</p>
             </div>
           </div>
         </div>`
   }
   ).join('')

        pokeContainer.innerHTML = cards;
}

const getType = (type) => {
    return `<p>${type.type.name}</p>`
}

fetchData();
