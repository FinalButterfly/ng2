import { Command, Event, isUndefined, RowEditor } from '@qgrid/core';

export class EditFormPanelPlugin {

  get editors() {
    return this.editor.editors;
  }

  get commands() {
    const commands = {
      submit: new Command({
        source: 'edit.form.panel',
        shortcut: this.shortcutFactory('commit'),
        execute: () => {
          this.editor.commit();
          this.submitEvent.emit();
        },
      }),
      cancel: new Command({
        source: 'edit.form.panel',
        shortcut: this.shortcutFactory('cancel'),
        execute: () => this.cancelEvent.emit(),
      }),
      reset: new Command({
        source: 'edit.form.panel',
        execute: () => {
          this.editor.editors.forEach(e => e.reset());
          this.resetEvent.emit();
        },
      }),
    };

    return commands;
  }

  constructor(plugin, context) {
    const { model, disposable } = plugin;

    this.plugin = plugin;
    this.editor = new RowEditor(context.row, model.columnList().line);
    this.caption = context.caption;

    this.submitEvent = new Event();
    this.cancelEvent = new Event();
    this.resetEvent = new Event();

    this.submit = this.commands.submit;
    this.cancel = this.commands.cancel;
    this.reset = this.commands.reset;

    if (!isUndefined(context.shortcut)) {
      disposable.add(context.shortcut.register(new Map(
        Object.entries(this.commands),
      )));
    }
  }

  shortcutFactory(type) {
    const { model } = this.plugin;
    return () => {
      const shortcuts = model.edit()[type + 'Shortcuts'];
      return shortcuts['reference'] || shortcuts['$default'];
    };
  }
}
