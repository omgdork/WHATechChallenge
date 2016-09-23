export default function ($filter) {
  return (input, decimalPlaces) => {
    return $filter('number')(input * 100, decimalPlaces) + '%';
  }
}
