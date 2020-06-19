import { Command } from '../command/command';
import { GridError } from '../infrastructure/error';
import * as sortService from '../sort/sort.service';
import { SORT_TOGGLE_COMMAND_KEY, FOCUS_AFTER_RENDER_COMMAND_KEY } from './command.bag';

export class SortToggleCommand extends Command {
    constructor(plugin) {
        const { model, commandPalette } = plugin;

        super({
            key: SORT_TOGGLE_COMMAND_KEY,
            canExecute: column => {
                return column && column.canSort !== false;
            },
            execute: column => {
                const { key } = column;
                const { by, mode } = model.sort();

                const sortBy = Array.from(by);
                const index = sortService.index(sortBy, key);
                if (index >= 0) {
                    const dir = sortService.direction(sortBy[index]);
                    switch (dir) {
                        case 'desc': {
                            sortBy.splice(index, 1);
                            break;
                        }
                        case 'asc': {
                            const entry = { [key]: 'desc' };
                            sortBy[index] = entry;
                            break;
                        }
                        default:
                            throw GridError(
                                'sort.toggle.command',
                                `Invalid sort direction ${dir}`
                            );
                    }
                }
                else {
                    if (mode === 'single') {
                        sortBy.length = 0;
                    }

                    const entry = { [key]: 'asc' };
                    sortBy.push(entry);

                    const order = sortService.orderFactory(model);
                    order(sortBy);
                }

                const focusAfterRender = commandPalette.get(FOCUS_AFTER_RENDER_COMMAND_KEY);
                focusAfterRender.execute();
                
                model.sort({
                    by: sortBy
                }, {
                    source: 'sort.toggle.command'
                });
            }
        });
    }
}
