import { Command } from '../command/command';

export class NavigationState {
	constructor() {
		this.cell = null;

		this.shortcut = {
			up: 'up',
			down: 'down',
			left: 'left',
			right: 'right',
			next: 'tab',
			previous: 'shift+tab',
			home: 'home',
			end: 'end',
			pageUp: 'pageUp',
			pageDown: 'pageDown',
			upward: 'shift+pageUp',
			downward: 'shift+pageDown'
		};

		this.go = new Command();
	}
}
