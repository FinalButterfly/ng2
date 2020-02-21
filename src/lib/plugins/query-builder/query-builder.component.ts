import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Command } from 'ng2-qgrid/core/command/command';
import { Action } from 'ng2-qgrid/core/action/action';
import { Composite } from 'ng2-qgrid/core/infrastructure/composite';
import { Disposable } from '../../infrastructure/disposable';
import { PluginService } from '../plugin.service';

@Component({
	selector: 'q-grid-query-builder',
	templateUrl: './query-builder.component.html',
	providers: [PluginService, Disposable]
})
export class QueryBuilderComponent implements OnInit {
	context: { $implicit: QueryBuilderComponent } = {
		$implicit: this
	};

	constructor(
		private plugin: PluginService,
		private disposable: Disposable
		) {
	}

	ngOnInit() {
		const { model } = this.plugin;
		const action =
			new Action(
				new Command(),
				'Query Builder',
				'filter'
			);

		action.templateUrl = 'plugin-query-builder.tpl.html';
		action.id = 'query-builder';

		const items =  Composite.list([model.action().items, [action]]);
		model.action({ items }, { source: 'query-builder.component' });

		this.disposable.add(() => {
			const newItems = model.action().items.filter(x => x.id === action.id);
			model.action({ items: newItems }, { source: 'query-builder.component' });
		});
	}
}
