import { classDecorator } from "./class";
import { methodDecorator } from "./method";


export function createServiceRoot() {

    return {
        classDecorator,
        methodDecorator
    }
}