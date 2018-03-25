export class Settings {
  constructor(
    public url: string,
    public user: string,
    public password: string,
    public users: string[],
    public projects: string[],
    public periods: Period[],
    public version: number
  ) {}
}

export class Period {
  constructor(
    public start: string,
    public end: string
  ) {}
}
