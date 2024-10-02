$(document).ready(function () {
  // Fetch the Pokédex data
  fetch("pokedex.json")
    .then((rawData) => rawData.json())
    .then((pokedex) => {
      let linkID = 0;

      // Loop through each Pokémon in the Pokédex
      pokedex.forEach((pokemon) => {
        let id = (pokemon["id"] + 1000).toString().slice(1);
        let name = pokemon["name"]["english"];
        let image = pokemon["image"]["hires"];
        let typesHtml = pokemon["type"]
          .map((type) => `<span class="${type}">${type}</span>`)
          .join("");

        // Append Pokémon card to the container
        $(".pokemon-container").append(
          `<div class="card">
              <a href="details.html?id=${linkID}" class="pokemon-link"><img src="${image}" alt="${name}"></a>
              <ul type="none">
                <li class="pokemon-id">#${id}</li>
                <li class="pokemon-name"><a href="details.html?id=${linkID++}">${name}</a></li>
                <li class="pokemon-type">${typesHtml}</li>
              </ul>
          </div>`
        );
      });
    });

  // Handle Pokémon details page
  const urlParams = new URLSearchParams(window.location.search);
  const pokemonId = urlParams.get("id");

  // Fetch details for a specific Pokémon
  if (pokemonId !== null) {
    fetch("pokedex.json")
      .then((rawData) => rawData.json())
      .then((pokedex) => {
        const pokemon = pokedex[pokemonId];
        if (pokemon) {
          // Populate Pokémon details
          $("#pokemon-page-name").text(pokemon.name.english);
          $(".pokemon-page-id").text(
            `#${(pokemon.id + 1000).toString().slice(1)}`
          );
          $(".pokemon-page-species").text(pokemon.species);
          $(".pokemon-page-description").text(pokemon.description);
          $(".pokemon-page-height").text(pokemon.profile.height);
          $(".pokemon-page-weight").text(pokemon.profile.weight);
          $(".pokemon-page-image").html(
            `<img src="${pokemon.image.hires}" alt="${pokemon.name.english}">`
          );

          // Display Pokémon abilities
          const abilitiesHtml = pokemon.profile.ability
            .map(
              (ability) => `<span class="pokemon-ability">${ability[0]}</span>`
            )
            .join(", ");
          $(".pokemon-page-abilities").html(abilitiesHtml);

          // Populate base stats
          const baseStats = pokemon.base;
          $(".hp-val").text(baseStats.HP);
          $(".attack-val").text(baseStats.Attack);
          $(".defense-val").text(baseStats.Defense);
          $(".sp-attack-val").text(baseStats["Sp. Attack"]);
          $(".sp-defense-val").text(baseStats["Sp. Defense"]);
          $(".speed-val").text(baseStats.Speed);

          // Total stats calculation
          const totalStats = Object.values(baseStats).reduce(
            (a, b) => a + b,
            0
          );
          $(".total").text(totalStats);

          // Update progress bars with animation
          animateStats(baseStats);
        }
      });
  }

function animateStats(baseStats) {
  const maxStat = 255; // Max value for the stats
  $(".bar div").css("width", "0%"); // Reset bar widths

  $(".hp-val .bar.hp div").animate(
    { width: (baseStats.HP / maxStat) * 100 + "%" },
    1000
  );
  $(".attack-val .bar.attack div").animate(
    { width: (baseStats.Attack / maxStat) * 100 + "%" },
    1000
  );
  $(".defense-val .bar.defense div").animate(
    { width: (baseStats.Defense / maxStat) * 100 + "%" },
    1000
  );
  $(".sp-attack-val .bar.sp-attack div").animate(
    { width: (baseStats["Sp. Attack"] / maxStat) * 100 + "%" },
    1000
  );
  $(".sp-defense-val .bar.sp-defense div").animate(
    { width: (baseStats["Sp. Defense"] / maxStat) * 100 + "%" },
    1000
  );
  $(".speed-val .bar.speed div").animate(
    { width: (baseStats.Speed / maxStat) * 100 + "%" },
    1000
  );
}
});
