////////////////////////////////
// Typy generyczne
////////////////////////////////

// problem - funkcja która pracuje z różnymi typami argumentów
function jestemElastyczna(arg: any) {
  return arg // say whaaat is it? 
}

// inny przykład - załóżmy że funkcja powinna zwracać ten sam typ który przyjmuje
function jestemElastyczna2(arg: string | number | boolean): string | number | boolean {
  return arg // say whaaat is it? 
}
// const x = jestemElastyczna2('13')
// niestety z zewnątrz taką funkcję przeczytamy jako: podaj string lub number lub boolean a ja zwrócę string lub number lub boolean
// nigdzie tutaj nie występuje kontrakt wiążący argument ze zwracanym typem!
// czyli mamy 9 kombinacji arg => ret

// co chcemy uzyskać:
// function jestemElastyczna2(arg: string ): string
// function jestemElastyczna2(arg: number): number  
// function jestemElastyczna2(arg:  boolean): boolean 

const xxs = jestemElastyczna2('true')

// rozwiązanie - typy generyczne (lub przeciążanie)
function jestemGenerykiem<ArgType extends string | number | boolean>(arg: ArgType): ArgType {
  return arg
}

const xx = jestemGenerykiem('10') // xx: number
const xx2 = jestemGenerykiem<number>(10) // xx: number

// uszczegóławiaj typ generyczny jeśli to możliwe
// przykład: chcemy pobierać tablicę w parametrze, ale nie wiemy z jakiego typu wartościami

// niepotrzebne <Type extends any[]> - to nam mówi że chcemy jakąkolwiek tablicę
// zwraca any
//👎 jak zatypować wartość zwrotną?
// function wezZGoryTablicyOgolna(arr: any[]) {
//   return arr.pop()
// }
function wezZGoryTablicyAny<Type extends any[]>(arr: Type) {
  return arr.pop()
}
const ostatniElementAny = wezZGoryTablicyAny<number[]>([1, 2]) // any :(

// 🆗 zwraca Type
// nie trzeba typować wartości zwrotnej (ale można!) - jest inferowana z return
function wezZGoryTablicyGeneric<Type>(arr: Type[]) {
  return arr.pop()
}
const ostatniElementNumber = wezZGoryTablicyGeneric<number>([1, 2, 3])    // number | undefined

// przykład wbudowanego w język generic types
// const people: string[] = []
// const people: Array<string> = []



///////////////////////////////////////////////
// inferowanie typu generycznego z argumentów
///////////////////////////////////////////////
function mapElementsToObjects<Item>(arr: Item[]): { elem: Item }[] {
  return arr.map(item => ({ elem: item }))
}
const somerArr = [1, 2, 3]
const data = mapElementsToObjects(somerArr) // ArrayItemType: number - z argumentu funkcji
const data2 = mapElementsToObjects<number>([]) // ArrayItemType: number - z argumentu funkcji

// tak właśnie używasz .querySelector:) - generyk inferowany z argumentu, na bogato (zobacz w definicji:))
const divElement = document.querySelector('body')



//////////////////////////////////
// fabryka typów generycznych
//////////////////////////////////
// uwaga na sposób deklarowania typów generycznych
// tutaj mamy jeden konkretny typ
type StringFn = (a: string) => string
type NumberFn = (a: number) => number
type BooleanFn = (a: boolean) => boolean
// uogólniamy
// type DynamicGenericFn = <T>(a: T) => T
type DynamicGenericFn = <T>(a: T) => T

// a to zadziała jak fabryka typów
type GenericFnGenerator<T> = (a: T) => T

// declare oznacza że tu deklarujemy że gdzieś tam, nie wiadomo gdzie, jest fn1
declare let gnFnString: DynamicGenericFn
declare let gnFnNumber: DynamicGenericFn
declare let fnBoolean: DynamicGenericFn
// tu mamy funkcje generyczne
gnFnString(12)
gnFnString('12')
gnFnString<boolean>(true)
gnFnNumber(12)
gnFnNumber('12')
gnFnNumber<boolean>(true)

// declare let fn2:genericFnGenerator //muszę podać <T>
declare let fnNumber: GenericFnGenerator<number> //muszę podać <T> // (a: number)
declare let fnString: GenericFnGenerator<string> //muszę podać <T>

// to już nie są funkcje generyczna
fnString('34')
fnNumber(12)
//@ts-expect-error
fnNumber('12')



////////////////////////////////
// Klasy generyczne
////////////////////////////////
class Collection<ItemType> {
  private _store: ItemType[] = []

  constructor(items?: ItemType[]) {
    items && this._store.push(...items)
  }
  add(item: ItemType) {
    this._store.push(item)
  }
  getAll(): ItemType[] {
    return this._store
  }
}
class Book {}
const books = new Collection<Book>()
// lub
const gameOfThrones = new Book()
const books2 = new Collection([gameOfThrones])
const bookList = books.getAll()




////////////////////////////////
// Ograniczanie typów generycznych
////////////////////////////////

// ograniczanie do listy typów
interface HasLength {
  length: number
}
function getLength<Type extends HasLength>(arg: Type): Type {
  console.log(arg.length)  // jesteśmy pewnie że arg ma .length
  return arg
}
function getLength2<Type extends string | any[]>(data: Type): { value: Type, length: number } {
  const length = (data as any).length ?? data.toString().length
  return {
    length,
    value: data
  }
}
getLength2('ala ma kota')
getLength2([123])
getLength('lorem lorem')

// używanie wielu typów generycznych
function getElement<DataType, ValueType>(data: DataType, value: ValueType): ValueType {
  let ret!: ValueType
  //robimy magię i zwracamy wynik
  return ret
}

// ograniczanie typów do kluczy innego obiektu
// omówimy dokładniej na typach złożonych, tu jako ciekawostka
// zwracany typ jest inferowany z return

// problem
{
  // function getProperty(obj: any, keyOfObj: string | number | symbol) {
  //   return obj[keyOfObj];
  // }
  // // i wtedy przechodzi coś takiego
  // getProperty({}, 'xx')
}

// rozwiązanie
function getProperty<ObjectType extends {}, KeyType extends keyof ObjectType>(obj: ObjectType, key: KeyType) {
  return obj[key]
}

const x2 = { a: 1, b: '2', c: 3, d: 4 }

const property = 'b'

const retString = getProperty(x2, property)  // 'b' jest ok, zwracany string
const retNumber = getProperty(x2, 'c')       // 'c' jest ok, zwracany number
// @ts-expect-error
const retErr = getProperty(x2, 'xx')

// rozwinięcie keyof ObjectType
// ObjectType => typeof x2 => {a: number, b: string, c: number, d: number}
// keyof typeof x2 => 'a' | 'b' | 'c' | 'd' 
// type T1 = typeof x2

// typów generycznych możesz używać we własnych typach
type ElementZOpisem<TypElementu> = {
  element: TypElementu,
  opis: string
}
// oraz w interfejsach
interface Slownik<TypDanych = string, TypKlucza = string> {
  dane: { klucz: TypKlucza, wartosc: TypDanych }[]
  znajdzJeden(klucz: TypKlucza): TypDanych
  znajdzWiele(klucze: TypKlucza[]): TypDanych[]
}

// jedziemy na defaultach
class KatalogPlytCD implements Slownik {
  dane = [{ klucz: 'dzem', wartosc: 'Cegła' }]
  znajdzJeden(klucz: string): string {
    const album = this.dane.find(el => el!.klucz === klucz)
    return album?.wartosc ?? ''
  }
  znajdzWiele(klucze: string[]) {
    return this.dane
      .filter(el => klucze.some(klucz => klucz === el.klucz))
      .map(el => el.wartosc)
  }
}
const katalog = new KatalogPlytCD()
const dzemik = katalog.znajdzJeden('dzem') //string
katalog.znajdzJeden('u2')

////////////////////////
// const T
// od TS5.0
////////////////////////

// mamy readonly string[] - czyli chcemy stałą tablicę
type HasNames = { names: readonly string[] }
function getNamesExactly<T extends HasNames>(arg: T): T["names"] {
  return arg.names
}
// 1. tu dostaniemy string[] - chociaż widzimy konkretne imiona 
// a z typu wynika że tablica miała być readonly (ale nie jest)
const names = getNamesExactly({ names: ["Alice", "Bob", "Eve"] })

// 2. readonly ["Alice", "Bob", "Eve"] - teraz mamy readonly tablicę
// działa ok, ale trzeba pamiętać o "as const"
const names2 = getNamesExactly({ names: ["Alice", "Bob", "Eve"] } as const)

// zmieniamy T na "const T"
function getNamesExactly2<const T extends HasNames>(arg: T): T["names"] {
  return arg.names
}
const names3 = getNamesExactly2({ names: ["Alice", "Bob", "Eve"] })