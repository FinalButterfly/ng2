import { Bag } from '../dom/bag';
import { Table } from '../dom/table';
import { AppError } from '../infrastructure/error';
import { uniq } from '../utility/kit';
import { Keyboard } from '../keyboard/keyboard';

export class GridCtrl {
	constructor(host, model, table, disposable) {
		this.model = model;
		this.table = table;

		const { grid } = model;
		if (grid().status === 'bound') {
			throw new AppError('grid.ctrl', `Model is already used by grid "${grid().id}"`);
		}

		if (!host.id) {
			host.id = model.grid().id;
		}

		grid({ status: 'bound' }, { source: 'grid.ctrl' });

		disposable.add(
			model.sceneChanged.watch(e => {
				if (e.hasChanges('column')) {
					this.invalidateVisibility();
				}
			})
		);

		disposable.add(
			() => model.grid({ status: 'unbound' }, { source: 'grid.ctrl' })
		);
	}

	keyUp(e) {
		const model = this.model;
		const code = Keyboard.translate(e.keyCode);
		const { codes } = model.keyboard();
		const index = codes.indexOf(code);
		if (index >= 0) {
			const newCodes = Array.from(codes);
			newCodes.splice(index, 1)
			model.keyboard({
				code,
				codes: newCodes,
				status: 'up'
			}, {
				source: 'key.up'
			});
		}

		model.keyboard({
			code: null,
			status: 'release'
		}, {
			source: 'key.up'
		});
	}

	keyDown(e, source = 'grid') {
		const { model } = this;
		const { shortcut } = model.action();

		const code = Keyboard.translate(e.keyCode);
		const result = shortcut.keyDown(e, source);
		if (result.length > 0) {
			e.preventDefault();
			e.stopPropagation();
		} else {
			if (e.target.tagName === 'TBODY') {
				const { prevent } = model.navigation();
				if (prevent.has(code)) {
					e.preventDefault();
					e.stopPropagation();
				}
			}
		}

		model.keyboard({
			code,
			codes: uniq(model.keyboard().codes.concat(code)),
			status: 'down'
		}, {
			source: 'key.down'
		});

		return result;
	}

	invalidateVisibility() {
		const { model } = this;
		const { left, right } = model.scene().column.area;
		const { pinTop, pinBottom } = model.row();

		model.visibility({
			pin: {
				left: left.length > 0,
				right: right.length > 0,
				top: pinTop.length > 0,
				bottom: pinBottom.length > 0
			}
		}, {
			source: 'grid.ctrl'
		});
	}

	invalidateActive() {
		const { view, model } = this.table;
		if (view.isFocused()) {
			model.focus({ isActive: true }, { source: 'grid.ctrl' });
		}
		else {
			model.focus({ isActive: false }, { source: 'grid.ctrl' });
		}
	}
}
