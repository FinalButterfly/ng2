import { columnFactory } from '../column/column.factory';
import * as columnService from '../column/column.service';
import { getType } from '../services/convert';
import { compile } from '../services/path';
import { clone, isUndefined } from '../utility/kit';

export class ColumnListHost {
  constructor(model, canCopy, parseFactory) {
    this.model = model;
    this.canCopy = canCopy;
    this.parseFactory = parseFactory;
  }

  generateKey(source) {
    if (!isUndefined(source.editor)) {
      return `$default.${source.editor}`;
    }

    if (!isUndefined(source.type)) {
      return `$default.${source.type}`;
    }

    return '$default';
  }

  copy(target, source) {
    const canCopy = this.canCopy;
    const parseFactory = this.parseFactory;

    Object.keys(source)
      .filter(key => canCopy(key, source, target))
      .forEach(key => {
        const sourceValue = source[key];
        const accessor = compile([key]);
        const targetValue = accessor(target);
        const targetType = getType(targetValue);
        let value = sourceValue;
        if (targetValue !== null && !isUndefined(targetValue)) {
          const parse = parseFactory(targetType);
          const typedValue = parse(sourceValue, targetValue);
          if (typedValue !== null) {
            value = typedValue;
          }
        }

        accessor(target, value);
      });
  }

  add(column) {
    const { columnList, scene, data } = this.model;

    const columns = columnList().columns.concat([column]);
    columnList({ columns }, {
      source: 'column.list.host',
      behavior: 'core',
    });

    if (scene().status !== 'idle') {
      data({
        columns: Array.from(data().columns),
      }, {
        source: 'column.list.host',
      });
    }
  }

  register(column) {
    const { columnList } = this.model;
    const reference = clone(columnList().reference);

    reference[column.type || '$default'] = column;
    columnList({ reference }, {
      source: 'column.list.host',
      behavior: 'core',
    });
  }

  extract(key, type) {
    const { model } = this;

    const buildColumn = columnFactory(model);

    let tplColumn = columnService.findColumn(model.columnList().line, key);
    if (tplColumn) {
      return buildColumn(type, tplColumn);
    }

    tplColumn = buildColumn(type || 'text').model;
    tplColumn.key = key;
    tplColumn.source = 'template';

    const dataColumn = columnService.findColumn(model.data().columns, key);
    if (dataColumn) {
      this.copy(tplColumn, dataColumn);
    }

    return tplColumn;
  }

  delete(key) {
    const { columnList, data } = this.model;

    const htmlColumns = columnList().columns;
    const index = columnService.findIndex(htmlColumns, key);
    if (index >= 0) {
      const columns = Array.from(htmlColumns);
      columns.splice(index, 1);
      columnList({ columns }, { source: 'column.list.host', behavior: 'core' });
    }

    const dataColumns = Array.from(data().columns);
    const line = columnService.findLine(dataColumns, key);
    if (line) {
      line.columns.splice(line.index, 1);

      // trigger columns pipe unit
      data({ columns: dataColumns }, { source: 'column.list.host' });
    }
  }
}
