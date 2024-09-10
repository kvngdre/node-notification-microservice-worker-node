export interface IWorker {
  execute(): Promise<void>;
}
