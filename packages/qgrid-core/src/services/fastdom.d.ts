export declare class Fastdom {
  static mutate: (task: () => void) => any;
  static measure: (task: () => void) => any;
  static clear(token: any): (task: () => void) => any;
  static invoke: (task: () => void) => any;
}
