export function getRiskColor(level: 'low' | 'moderate' | 'high') {
  if (level === 'high') return 'text-red-500'
  if (level === 'moderate') return 'text-yellow-500'
  return 'text-green-500'
}