
import { Player } from '/assets/games/space_invaders/js/Player.js';
import { Setup } from '/assets/games/space_invaders/js/Setup.js';

const player = new Player();
const setup = new Setup(player);
player.setSetup(setup);
