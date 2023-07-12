export class NestClient {
  readonly refreshToken: string;
  constructor(refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  async authorize(): Promise<void> {
    return;
  }
}
