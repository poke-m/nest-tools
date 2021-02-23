import { Injectable } from '@nestjs/common';

@Injectable()
export class StoreProvider<Keys> {
  /**
   * Only keys declared in a union type are allowed to be stored
   */
  private readonly store = new Map<Keys, any>();

  /**
   * Get the corresponding instance from the literal union type
   */
  public get<T = any>(key: Keys): T {
    return this.store.get(key);
  }

  /**
   * Set the corresponding instance from the literal union type
   */
  public save<T = any>(key: Keys, value: T): T {
    this.store.set(key, value);
    return value;
  }
}

