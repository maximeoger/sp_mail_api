import * as Koa from 'koa';

export default class Index {

  readonly port: number;

  constructor (port: number) {
    this.port = port;
  }

  start () {
    const app = new Koa();
    app.listen(this.port);
    console.info(`Server started on port ${this.port}`);
  }
}