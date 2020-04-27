import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { DomTr } from '../dom/dom';
import { GridView } from '../grid/grid-view';
import { GridRoot } from '../grid/grid-root';

@Directive({
	selector: '[q-grid-core-trh]'
})
export class TrhCoreDirective implements DomTr, OnInit, OnDestroy {
	@Input('q-grid-core-index') index: number;
	@Input('q-grid-core-trh') model: any;
	@Input('q-grid-core-source') source;

	element: HTMLElement;

	constructor(
		public $view: GridView,
		private root: GridRoot,
		elementRef: ElementRef
	) {
		this.element = elementRef.nativeElement;
	}

	ngOnInit() {
		this.root.table.context.bag[this.source].addRow(this);
	}

	ngOnDestroy() {
		this.root.table.context.bag[this.source].deleteRow(this);
	}
}
