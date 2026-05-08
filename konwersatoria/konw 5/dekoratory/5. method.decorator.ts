function measurePerformance<T extends (...args: any[]) => any>(
  originalMethod: T,
  context: ClassMethodDecoratorContext
) {
  const methodName = String(context.name)

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> {
    const start = performance.now()
    const ret = originalMethod.apply(this, args)
    const end = performance.now()

    console.log(`Execution time of ${methodName}: ${(end - start).toFixed(2)}ms`)
    return ret
  }
}

class Table {

  @measurePerformance
  prepareData() {
    console.log('Prepare data')
    let x = 0
    do {
      x++
      const y = Math.sqrt(x)
    } while (x < 1_000_000)
  }
}

setTimeout(() => {
  const users = new Table()
  users.prepareData()
}, 2000)

export {}