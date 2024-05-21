export abstract class ValueObject<T> {
  constructor(protected props: T) {}

  equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) return false;

    if (vo.props === undefined) return false;

    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
