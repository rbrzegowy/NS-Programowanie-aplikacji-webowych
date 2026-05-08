// ewaluacja następuje z góry na dół, wywołanie - z dołu do góry, metoda jest ostatnia
function firstDecorator() {
    console.log("Ewaluacja firstDecorator")
    return function <This, Args extends any[], Return>(
        target: (this: This, ...args: Args) => Return,
        context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
    ) {
        console.log("Odwołanie do metody - firstDecorator")
        return target
    }
}

function secondDecorator() {
    console.log("Ewaluacja secondDecorator")
    return function <This, Args extends any[], Return>(
        target: (this: This, ...args: Args) => Return,
        context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
    ) {
        console.log("Odwołanie do metody - secondDecorator")
        return target
    }
}

class Foo {
    @firstDecorator()
    @secondDecorator()
    bar() {
        console.log("Odwołanie do Foo.Bar()")
    }
}

let c = new Foo().bar()