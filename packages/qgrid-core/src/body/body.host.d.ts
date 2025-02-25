import { GridPlugin } from '../plugin/grid.plugin';

export declare class BodyHost {
  constructor(plugin: GridPlugin);

  scroll(e: { scrollLeft: number; scrollTop: number });
  wheel(e: WheelEvent);

  mouseLeave(e: MouseEvent);
}
