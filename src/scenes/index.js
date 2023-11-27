import CONSTANTS from '../constants';
import TitleScene from './TitleScene/TitleScene.js';
import ForkliftScene from './ForkliftScene/ForkliftScene.js';
import ControlPanelScene from './ControlPanelScene/ControlPanelScene.js';

let SCENES = [ForkliftScene, ControlPanelScene];

if (!CONSTANTS.environment.isDev()) {
  SCENES = [TitleScene, ...SCENES];
}

SCENES.forEach(s => CONSTANTS.AddKey(s.name));

export default SCENES;
