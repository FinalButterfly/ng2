import { find, findLeaves } from '../node/node.service';
import { Command } from '../command/command';
import { GRID_PREFIX } from '../definition';
import { COLUMN_DRAG_COMMAND_KEY } from './command.bag';

export class ColumnDragCommand extends Command {
    constructor(plugin) {
        const { table, model } = plugin;

        super({
            key: COLUMN_DRAG_COMMAND_KEY,
            canExecute: e => {
                const sourceKey = e.data;
                const { index } = model.columnList();
                const pos = find(index, node => node.key.model.key === sourceKey);
                return pos && pos.node.key.model.canMove;
            },
            execute: e => {
                const sourceKey = e.data;
                const { index } = model.columnList();
                const pos = find(index, node => node.key.model.key === sourceKey);
                if (pos) {
                    for (let leaf of findLeaves(pos.node)) {
                        const column = table.body.column(leaf.key.columnIndex);
                        column.addClass(`${GRID_PREFIX}-drag`);
                        return () => table.head.cell;
                    }
                }
            },
        });
    }
}
