export interface EntityData {
  id: number;
}

const isEntity = (v: unknown): v is Entity => {
  return v instanceof Entity;
};

export abstract class Entity implements EntityData {
  constructor(public id: number) {}

  equals(object?: Entity): boolean {
    if (object === null || object === undefined) return false;

    if (this === object) return true;

    if (!isEntity(object)) return false;

    return this.id === object.id;
  }
}
