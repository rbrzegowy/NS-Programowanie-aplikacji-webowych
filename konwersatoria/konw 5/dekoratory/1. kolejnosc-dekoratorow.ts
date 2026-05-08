function log(val: any): any {
  console.warn("EWALUACJA: ", val)
  return function <This, Args extends any[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
  ) {
    console.log("Wywołanie", val)
    return target
  }
}

// Kolejność wywołania dekoratorów:
// 1. metody i parametry metod
// 2. właściwości klasy
// 3. metody statyczne i parametry metod
// 4. wlaściwości statyczne
// 5. konstruktor
// 6. Klasa
@log("Klasa")
class DekorowanaKlasa {
  _bar!: number
  @log("Metoda obiektu")
  method(foo: any) {}

  // tylko stare dekoratory mogą argumenty metody
  // method(@log("Parametr metody obiektu") foo: any) {}

  @log("Właściwość statyczna")
  static Bar?: number

  @log("Właściwość obiektu")
  baz!: number

  constructor(foo: any) {}

  @log("Getter właściwości obiektu")
  get bar(): number {
    return this._bar
  }
}

const obj = new DekorowanaKlasa('foo arg')

