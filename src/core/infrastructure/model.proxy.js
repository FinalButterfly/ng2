import { Guard } from './guard';
import { Disposable } from './disposable';

export class ModelProxy extends Disposable {
    constructor(model) {
        super();

        const modelHandler = {
            get: (target, key) => {
                Guard.hasProperty(target, key);

                if (key.endsWith('Changed')) {
                    const eventHandler = {
                        get: (event, key) => (...args) => this.using(event[key](...args))
                    };

                    return new Proxy(target[key], eventHandler);
                }

                return target[key];
            }
        };

        this.subject = new Proxy(model, modelHandler);
    }
}