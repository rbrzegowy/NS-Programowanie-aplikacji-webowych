// Problem - chcemy klasę Cache z timeout.
// Domyślnie - cache jest przechowywany w pamięci
// Chcemy też, żeby klasa była elastyczna i pozwalała na łatwe dodawanie nowych 
// sposobów przechowywania danych (np. sessionStorage, IndexedDB itp.) 
// bez konieczności modyfikowania istniejącego kodu klasy Cache.

// typy
export type Timestamp = number
export type Miliseconds = number
export type CacheRecord<T = unknown> = {
  value: T
  expiresAt: Timestamp
}

export type CacheOptions = {
  defaultTimeout: Miliseconds
  storage?: CacheStorageAdapter
}

// interfejs dla storage
export interface CacheStorageAdapter {
  // generyk idzie osobno do get i set - możliwa jest obsługa różnych typów danych w cache'u
  get<T>(key: string): (CacheRecord<T> | undefined) | Promise<CacheRecord<T> | undefined>
  set(key: string, record: CacheRecord): boolean | Promise<boolean>
  delete(key: string): boolean | Promise<boolean>
  has(key: string): boolean | Promise<boolean>
  clear(): boolean | Promise<boolean>
}

export class MemoryCacheStorage implements CacheStorageAdapter {
  private readonly store = new Map<string, CacheRecord>()

  get<T>(key: string) {
    const record = this.store.get(key)
    if (!record) {
      return undefined
    }
    return record as CacheRecord<T>
  }

  set(key: string, record: CacheRecord) {
    this.store.set(key, record)
    return true
  }

  delete(key: string) {
    return this.store.delete(key)
  }

  has(key: string) {
    return this.store.has(key)
  }

  clear() {
    this.store.clear()
    return true
  }
}

export class Cache {
  private readonly storage: CacheStorageAdapter
  private readonly defaultTimeout: Miliseconds

  constructor(options: CacheOptions) {
    this.defaultTimeout = options.defaultTimeout
    this.storage = options.storage ?? new MemoryCacheStorage()
  }

  private createExpiresAt(timeout: Miliseconds) {
    return Date.now() + timeout
  }
  private isExpired(record: CacheRecord) {
    return record.expiresAt <= Date.now()
  }

  async set(key: string, value: unknown, timeout: Miliseconds = this.defaultTimeout as Miliseconds): Promise<void> {
    this.validateTimeout(timeout)
    this.validateValue(value)

    const record: CacheRecord = {
      value,
      expiresAt: this.createExpiresAt(timeout)
    }

    await this.storage.set(key, record)
  }

  async get<T>(key: string): Promise<T | null> {
    const record = await this.storage.get<T>(key)
    if (!record) {
      return null
    }

    if (this.isExpired(record)) {
      await this.storage.delete(key)
      return null
    }

    return record.value
  }

  async has(key: string): Promise<boolean> {
    const value = await this.get(key)

    return value !== null
  }

  async delete(key: string): Promise<void> {
    await this.storage.delete(key)
  }

  async clear(): Promise<void> {
    await this.storage.clear()
  }

  private validateTimeout(timeoutMs: number): asserts timeoutMs {
    if (timeoutMs <= 0) {
      throw new Error('czas wygasania cache (timeoutMs) musi być liczbą dodatnią!')
    }
  }
  private validateValue(val: unknown): asserts val {
    if (val === undefined) {
      throw new Error('wartość cache (val) nie może być undefined!')
    }
  }
}

// Przykładowy adapter dla sessionStorage.
export class SessionStorageAdapter implements CacheStorageAdapter {
  constructor(private readonly keyPrefix = 'cache//') {}

  get<T>(key: string): CacheRecord<T> | undefined {
    const jsonData = sessionStorage.getItem(this.createKey(key))
    if (!jsonData) {
      return undefined
    }

    return JSON.parse(jsonData) as CacheRecord<T>
  }

  set<T>(key: string, record: CacheRecord<T>) {
    sessionStorage.setItem(this.createKey(key), JSON.stringify(record))
    return true
  }

  delete(key: string) {
    sessionStorage.removeItem(this.createKey(key))
    return true
  }
  has(key: string) {
    const json = this.get(this.createKey(key))
    return json !== undefined
  }

  clear() {
    Object.keys(sessionStorage)
      .filter(key => key.startsWith(this.keyPrefix))
      .forEach(key => sessionStorage.removeItem(key))
    return true
  }

  private createKey(key: string): string {
    return `${this.keyPrefix}${key}`
  }
}

// Przykład użycia:
// Domyślny cache w pamięci z timeoutem 2 sekund
const cache = new Cache({ defaultTimeout: 2000 })
const sessionCache = new Cache({
  defaultTimeout: 5000,
  storage: new SessionStorageAdapter('app-cache//')
})
