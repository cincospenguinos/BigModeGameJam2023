import CONSTANTS from '../constants';
import TitleScene from './TitleScene/TitleScene.js';
import BootScene from './BootScene/BootScene.js';
import ForkliftScene from './ForkliftScene/ForkliftScene.js';
import ControlPanelScene from './ControlPanelScene/ControlPanelScene.js';

let SCENES = [BootScene, ForkliftScene, ControlPanelScene];

if (!CONSTANTS.environment.isDev()) {
  SCENES = [TitleScene, ...SCENES];
}

SCENES.forEach(s => CONSTANTS.AddKey(s.name));

export default SCENES;
