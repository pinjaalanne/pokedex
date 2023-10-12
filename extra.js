document.addEventListener("DOMContentLoaded", () => {
    const pokeContainer = document.querySelector('.pokecontainer');
    const input = document.querySelector('#search');
    const geneButtons = document.querySelectorAll('.generations');
    const clearButton = document.querySelector('#clear');
    
    let pokeData = [];
    let currentGeneration = "generation-i"; // Initialize the current generation
    
    async function fetchPokemonsByGeneration(generation) {
        try {
            const generationDataResponse = await fetch(`https://pokeapi.co/api/v2/generation/${generation}`);
            const generationData = await generationDataResponse.json();
            const speciesUrls = generationData.pokemon_species.map(species => species.url);
            const pokemonData = await Promise.all(speciesUrls.map(url => fetchData(url, generation)));
            showPokes(pokemonData);
            currentGeneration = generation; // Update the current generation
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    async function fetchData(url, generation) {
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
                generation: generation, // Include the generation data
            };
        }
    }
    
    geneButtons.forEach(button => {
        button.addEventListener('click', () => {
            input.classList.add('visible')
            const generation = button.getAttribute('data-generation');
            fetchPokemonsByGeneration(generation);
        });
    });
    
    clearButton.addEventListener('click', () => {
        input.value = "";
        currentGeneration = "generation-i"; // Reset to the default generation
        fetchPokemonsByGeneration(currentGeneration);
    });
    
    function showPokes(filterData = pokeData) {
        const pokeCards = filterData.map(pokemon => {
            return `<div class="pokebox">
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
    
        pokeContainer.innerHTML = pokeCards;
    }
    
    const searchPokes = () => {
        input.addEventListener("keyup", () => {
            const searchString = input.value.toLowerCase();
            const filteredPokemons = pokeData.filter(pokemon => {
                return (
                    pokemon.name.toLowerCase().includes(searchString) &&
                    (pokemon.generation === currentGeneration)
                );
            });
            showPokes(filteredPokemons);
        });
    }
    
    // Initial data fetch
    fetchPokemonsByGeneration(currentGeneration);
    searchPokes();
});
ChatGPT
