import { Injector } from '@angular/core';

export class PepeInjector {
    private static injector: Injector;

    static setInjector(injector: Injector) {
        PepeInjector.injector = injector;
    }

    static getInjector(): Injector {
        return PepeInjector.injector;
    }
}