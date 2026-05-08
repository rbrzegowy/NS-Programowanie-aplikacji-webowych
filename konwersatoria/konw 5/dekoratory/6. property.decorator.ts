function Render(target: undefined, context: ClassFieldDecoratorContext) {

  console.log('Render decor fired')
  // console.log(context)
  return function (initialValue: any) {
    console.log(`Rendering ${String(context.name)}!`)
    console.log(`Title: ${initialValue}`)
    if (!initialValue) {
      throw new Error('Set default title!')
    }
    return initialValue
  }
}
class Component {
  @Render
  title = 'def'

  init() {}
}

console.log('Create component')
const avatar = new Component()
console.log(`Change title, current: ${avatar.title}`)
avatar.title = 'Avatar'
console.log('Read title:', avatar.title)