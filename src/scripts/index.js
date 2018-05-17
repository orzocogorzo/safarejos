import { App } from "./App";
import style from '../styles/index.styl';
import vendor from '../styles/vendor.css';

import parceles from './data/parceles';
import equipaments from './data/equipaments';
import municipis from './data/municipis';

window.parceles = parceles;
window.equipaments = equipaments;
window.municipis = municipis;

var app = new App();