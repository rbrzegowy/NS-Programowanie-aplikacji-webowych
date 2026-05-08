
// -------------------
// fabryka dekoratorów
// -------------------
type MethodDecorator = <This, Args extends any[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) => ((this: This, ...args: Args) => Return) | void

function logTo(storage: 'console' | 'db'): MethodDecorator {
    return storage === 'console'
        ? logToConsole
        : logToDb

}
function logToConsole<This, Args extends any[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
    console.log("LOG IT: ", target, context)
    return target
}
function logToDb<This, Args extends any[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
    console.log("LOGGED TO DB: ", target, context)
    return target
}


class CarRental {
    carList: string[] = [];

    @logTo('db')
    addCar(brand: string) {
        console.log('new car added: ', brand)
        this.carList.push(brand)
    }


}
let cr = new CarRental()
cr.addCar('audi')
console.warn(cr.carList)

export {}