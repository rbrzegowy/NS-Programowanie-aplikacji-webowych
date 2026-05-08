// case - chcemy zapisywać dane, nie wiemy jakie będą mechanizmy przechowywania, 
// chcemy mieć możliwość łatwej zmiany mechanizmu przechowywania i dodawania kolejnych mechanizmów bez konieczności modyfikowania istniejącego kodu klasy TaskService (Open/Closed Principle).

// kolekcja idzie jako argument w initialize, również można ją zrealizować jako DI (wtedy klasa abstrakcyjna)
type MyStorage = {
  initialize(collection: string): void

  set: <T, U>(value: T) => U
  update: <T, U>(key: U, value: T) => void
  get: <T, U>(key: U) => T | null
  remove: <T>(key: T) => void
  list: <T>() => T[]
}

class TaskService<T> {
  collection = 'tasks';
  tasks: T[] = []

  constructor(private storage: MyStorage) {
    storage.initialize(this.collection)
  }

  create(task: T) {
    this.tasks = [...this.tasks, task]
    this.storage.set(this.tasks)
  }

  update(task: T, id: number) {
    this.storage.update(id, task)
  }

  delete(id: number) {
    this.storage.remove(id)
  }

  get(id: number) {
    return this.storage.get(id)
  }

  list() {
    return this.storage.list()
  }
}

class LocalStorageService implements MyStorage {
  private collection: string | null = null;
  initialize(collection: string): void {
    this.collection = collection
  }
  checkNoCollection() {
    if (!this.collection) {
      throw new Error('Collection not initialized')
    }
  }
  set<T, U>(value: T): U {
    this.checkNoCollection()
    // fn logic
    return {} as U
  }
  update<T, U>(key: U, value: T) {
    this.checkNoCollection()
    // fn logic
  }
  get<T, U>(key: U): T | null {
    this.checkNoCollection()
    // fn logic
    return null
  }
  remove<T>(key: T) {
    this.checkNoCollection()
    // fn logic
  }
  list() {
    this.checkNoCollection()
    // fn logic
    return []
  }
}
class FirestoreStorageService implements MyStorage {
  private collection: string | null = null;
  initialize(collection: string): void {
    this.collection = collection
  }
  checkNoCollection() {
    if (!this.collection) {
      throw new Error('Collection not initialized')
    }
  }
  set<T, U>(value: T): U {
    this.checkNoCollection()
    // fn logic
    return {} as U
  }
  update<T, U>(key: U, value: T) {
    this.checkNoCollection()
    // fn logic
  }
  get<T, U>(key: U): T | null {
    this.checkNoCollection()
    // fn logic
    return null
  }
  remove<T>(key: T) {
    this.checkNoCollection()
    // fn logic
  }
  list() {
    this.checkNoCollection()
    // fn logic
    return []
  }
}

const storages = {
  local: LocalStorageService,
  firestore: FirestoreStorageService
}

const ENV_CONFIG_STORAGE: keyof typeof storages = 'local'



const storage = new storages[ENV_CONFIG_STORAGE]()

const taskService = new TaskService(storage)
// const projectService = new ProjectService(storage);
// const storyService = new StoryService(storage);
// const usersService = new UsersService(storage);