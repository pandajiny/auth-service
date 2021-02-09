import mysql, { ConnectionOptions } from "mysql2/promise";
import { dbOptions } from "../constants";

const USER_DB = `user_db`;
const USERS = `users`;

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
        FROM ${USER_DB}.${USERS}
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
        FROM ${USER_DB}.${USERS}
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

export const dbService = {
  findUserFromEmail,
  findUserFromUid,
};
