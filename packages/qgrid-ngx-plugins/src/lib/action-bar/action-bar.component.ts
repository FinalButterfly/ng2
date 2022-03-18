import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Action } from '@qgrid/core';
import { GridPlugin } from '@qgrid/ngx';

@Component({
	selector: 'q-grid-action-bar',
	templateUrl: './action-bar.component.html',
	providers: [GridPlugin],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionBarComponent implements OnInit {

	context: { $implicit: ActionBarComponent } = {
		$implicit: this
	};

	constructor(
		private plugin: GridPlugin,
		private cd: ChangeDetectorRef,
	) {
	}

	ngOnInit() {
		const { model, observe } = this.plugin;

		observe(model.actionChanged)
			.subscribe(e => {
				const initialItems = e.state.items;
				const sortedItems = initialItems.sort((a: Action, b: Action) => {
					return a.command.priority - b.command.priority;
				});

				const sorted = sortedItems.every((item: Action, index: number) => {
					return item.title = initialItems[index].title;
				});

				if(sorted) {
					this.cd.markForCheck();
					this.cd.detectChanges();
				} else {
					model.action({
						items: sortedItems
					});
				}

				if (e.hasChanges('items')) {
					this.cd.markForCheck();
					this.cd.detectChanges();
				}
			});
	}

	get actions(): Action[] {
		const { model } = this.plugin;
		return model.action().items;
	}
}
