import mysql from "mysql2/promise";
import { dbOptions } from "../constants";
import { BadRequestException } from "../handlers";

const USERS_TABLE = `users`;

async function execute<T>(query: string): Promise<T[]> {
  const conn = await mysql.createConnection(dbOptions);
  const [results] = await conn.execute(query);
  await conn.end();
  if (results && Array.isArray(results) && results.length > 0) {
    return (results as Array<T>).map((v) => ({ ...v }));
  } else {
    return [];
  }
}

async function findUserFromEmail(email: string): Promise<User | null> {
  const query = `
        SELECT *
        FROM ${USERS_TABLE}
        WHERE email = "${email}"
    `;
  const users = await execute<User>(query);

  if (users.length == 0) {
    return null;
  }
  if (users.length == 1) {
    return users[0];
  } else {
    console.error(users);
    throw `user duplicated`;
  }
}

async function findUserFromUid(uid: string): Promise<User | null> {
  const query = `
        SELECT *
        FROM ${USERS_TABLE}
        WHERE uid = "${uid}"
    `;
  const users = await execute<User>(query);

  if (users.length == 0) {
    return null;
  }
  if (users.length == 1) {
    return users[0];
  } else {
    console.error(users);
    throw `user duplicated`;
  }
}

async function createUser(user: User) {
  const { _password, email, name, uid } = user;

  const query = `
    INSERT INTO ${USERS_TABLE} (uid, name, email, _password)
    VALUES ("${uid}", "${name}", "${email}", "${_password}")
  `;
  await execute(query).catch((err) => {
    console.error(err);
    throw new BadRequestException("Cannot create user");
  });
}

export const dbService = {
  findUserFromEmail,
  findUserFromUid,
  createUser,
};
