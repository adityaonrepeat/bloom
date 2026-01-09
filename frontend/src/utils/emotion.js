export function getEmotionLevel(score) {
  if (score >= 40) return "Calm"
  if (score >= 25) return "Balanced"
  return "Stressed"
}
