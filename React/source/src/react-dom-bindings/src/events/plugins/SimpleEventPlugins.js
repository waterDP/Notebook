import {
  registerSimpleEvents,
  topLevelEventsToReactNames,
} from "../DOMEventProperties";
import { IS_CAPTURE_PHASE } from "../EventSystemFlags";
import { accumulateSinglePhaseListeners } from "../DOMPluginEventSystem";

function extractEvents(
  dispatchQueue,
  domEventName,
  targetInst,
  nativeEvent,
  nativeEventTarget, // click => onClick
  eventSystemFlags,
  targetContainer
) {
  const reactName = topLevelEventsToReactNames.get(domEventName);
  const isCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
  const listeners = accumulateSinglePhaseListeners(
    targetInst,
    reactName,
    nativeEvent.type,
    isCapturePhase
  );
  debugger;
  console.log("listener", listeners);
}

export { registerSimpleEvents as registerEvents, extractEvents };
