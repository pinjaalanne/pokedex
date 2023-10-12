// taking the data from index
const pokeContainer = document.querySelector('.pokecontainer');
const input = document.querySelector('#search');
const geneButtons = document.querySelectorAll('.generations');
const geneAmount = document.querySelector('.genAmount');
const backButton = document.querySelector('.backtotop');

let pokemonData = [];
let currentGeneration = ""; // putting the initial generation as an empty string

// fetching the data per generation
const fetchPokeGeneration = async (generation) => {
    const genDataRes = await fetch(`https://pokeapi.co/api/v2/generation/${generation}`);
    const genData = await genDataRes.json();
    const speciesUrls = genData.pokemon_species.map(species => species.url);
    pokemonData = await Promise.all(speciesUrls.map(url => fetchData(url, generation)));
    showPokes(pokemonData); // show the data
    currentGeneration = generation; // update to the current generation
    pokeCounter(pokemonData); // count the amount of pokemons and show it
}

// fetching details of each pokemon
const fetchData = async (url, generation) => {
    if (url) {
        const response = await fetch(url);
        const data = await response.json();
        const pokemonRes = await fetch(data.varieties[0].pokemon.url);
        const pokemon = await pokemonRes.json();
        return {
            id: pokemon.id,
            name: pokemon.name,
            img: pokemon.sprites.other['official-artwork'].front_default,
            types: pokemon.types,
            height: pokemon.height,
            weight: pokemon.weight,
            generation: generation,
        };
    }
}

// searching the pokemons by name
const searchPokes = async () => {
    input.addEventListener("keyup", async () => {
        await fetchPokeGeneration(currentGeneration);
        const searchString = input.value.toLowerCase();
        const filteredPokemons = pokemonData.filter(pokemon => {
            return (
                pokemon.name.toLowerCase().includes(searchString) &&
                (pokemon.generation === currentGeneration)
            );
        });
        showPokes(filteredPokemons);
    });
}

// adding functionality to generation buttons
geneButtons.forEach(button => {
    button.addEventListener('click', () => {
        input.classList.add('visible'); // adding the search bar to be visible
        const generation = button.getAttribute('id'); // getting the correct generation by id
        fetchPokeGeneration(generation);
        currentGeneration = generation; // updating the current generation
    });
});

const showPokes = (filterData = pokemonData) => {
    // filtering and displaying the pokemon data
    const pokeCards = filterData.map(pokemon => {
        return `<div class="pokebox">
            <p class="number">#${pokemon.id}</p>
            <div class="pokeboximg">
                <img class="pokeimg" src="${pokemon.img}" alt="no img" />
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

    pokeContainer.innerHTML = pokeCards;
}

// counting the length = amount of pokemons in current generation
const pokeCounter = (pokemonData) => {
    geneAmount.innerHTML = `There are ${pokemonData.length} pokemons in ${currentGeneration}`;
};

// adding a scroll function to get back to top button
window.onscroll = function () {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        backButton.style.display = "block";
      } else {
        backButton.style.display = "none";
      }
}

// function for back to top button
const getToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// calling the functions
searchPokes();
fetchPokeGeneration(currentGeneration);
backButton.addEventListener('click', getToTop) // back to top button