
const services = new Set()


function Service(target: Function, context: ClassDecoratorContext) {
  console.log(target)
  console.log(context)

  // możemy zmienić zawartość dekorowanej klasy
  target.prototype.___isMemoized = true

  context.addInitializer(function (this: any) {
    services.add(this)
    console.log('Additional initialize to class')
  })
}

@Service
class Sidenav {
  title!: string

  open() {}
}
// dekorator klasy wywołuje się podczas jej deklaracji, nie trzeba tworzyć obiektu
console.log('NEW component')
const sidenav = new Sidenav()
console.log((sidenav as any).___isMemoized)
console.log('Sidenav created')

export {}