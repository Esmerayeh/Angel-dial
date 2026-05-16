export function getDailyMutationSeed(date = new Date()) {
  const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  return key.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

export function getDailyMutation(seed: number) {
  const mutations = [
    "one pearl arcade moved three pixels closer to the water",
    "the elevator chain learned a softer bounce",
    "a moth polished the loading flower",
    "Archive Ocean rose gently behind the fountain",
    "SERAPH-404 replaced one prayer wheel with a moon button",
    "a ghost opened a curtain inside another curtain",
  ];

  return mutations[seed % mutations.length];
}
