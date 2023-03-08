export default function getEventTarget(nativeEvent) {
  const target = nativeEvent.target || nativeEvent.srcEvent || window;
  return target;
}
