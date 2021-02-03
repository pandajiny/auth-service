interface User {
  uid: string;
  name: string;
  email: string;
  _password: string;

  create_at: number;
}

interface UserDTO {
  uid: string;
  name: string;
  email: string;
}
