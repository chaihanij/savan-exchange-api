export class ResponseWrapper<T> {
  data: T;
  total: number;
  limit: number;
  skip: number;

  constructor(data: T, total: number, limit: number = 100, skip: number = 0) {
    this.data = data;
    this.total = total;
    this.limit = limit;
    this.skip = skip;
  }
}
