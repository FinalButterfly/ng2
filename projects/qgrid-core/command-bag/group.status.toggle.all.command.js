import { Command } from '../command/command';
import { PipeUnit } from '../pipe/pipe.unit';
import { preOrderDFS } from '../node/node.service';
import { GROUP_STATUS_TOGGLE_ALL_COMMAND_KEY, GRID_INVALIDATE_COMMAND_KEY } from './command.bag';

export class GroupStatusToggleAllCommand extends Command {
    constructor(plugin) {
        const { model, commandPalette } = plugin;

        let shouldExpand = true;
        super({
            key: GROUP_STATUS_TOGGLE_ALL_COMMAND_KEY,
            canExecute: () => {
                const { toggleAll } = model.group();
                return toggleAll.canExecute() === true;
            },
            execute: () => {
                const { toggleAll } = model.group();
                if (toggleAll.execute() !== true) {
                    const { nodes } = model.view();
                    const { toggle } = model.group();

                    preOrderDFS(nodes, node => {
                        if (toggleStatus.canExecute([node]) === true) {
                            if (toggle.execute(node) !== true) {
                                node.state.expand = shouldExpand;
                            }
                        }
                    });

                    shouldExpand = !shouldExpand;

                    const invalidate = commandPalette.get(GRID_INVALIDATE_COMMAND_KEY);
                    invalidate.execute({
                        source: 'group.status.toggle.all.command',
                        pipe: PipeUnit.group,
                        why: PipeUnit.group.why
                    });

                    return true
                }

                return false;
            }
        });
    }
}
