export class Login {
  // TODO: Mukesh - change backend signin key from username to email
  // in order to match front end
  // Remember is disabled until we figure things out
  email: string;
  password: string;
  remember?: boolean;

  constructor(email: string, password: string, remember?: boolean) {
    this.email = email;
    this.password = password;
    // this.remember = remember;
  }
}
