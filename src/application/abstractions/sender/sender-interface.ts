export interface ISender<T> {
  send(data: T): void;
}
