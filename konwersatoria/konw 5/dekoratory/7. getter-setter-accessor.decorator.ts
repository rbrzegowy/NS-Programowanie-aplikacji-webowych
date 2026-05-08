// dekoratory getter/setter
function getterDecorator(
  value: Function,
  context: ClassGetterDecoratorContext
) {
  return function (this: any) {
    return value.call(this)
  }
}

function setterDecorator(
  value: Function,
  context: ClassSetterDecoratorContext
) {
  return function (this: any, val: any) {
    return value.call(this, val)
  }
}

function accessorDecorator(
  value: { get: () => any; set: (value: any) => void },
  context: ClassAccessorDecoratorContext
) {
  return {
    get() { return value.get.call(this) },
    set(val: any) { value.set.call(this, val) },
    init(initialValue: any) { return initialValue }
  }
}

class User {
  name = "Katarzyna"
  role = "Senior Developer"

  @accessorDecorator
  accessor status = "online"

  @getterDecorator
  get info() { return `Imię: ${this.name}, Rola: ${this.role}` }

  logMe() { console.log(this) }
}

const kaska = new User()

export {}