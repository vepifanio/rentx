import { v4 as uuidV4 } from "uuid";
import { hash } from "bcryptjs";

import createConnection from "../index";

async function create() {
  const connection = await createConnection("localhost");

  const id = uuidV4();
  const password = await hash("admin", 8);

  connection.query(
    `INSERT INTO USERS(id, name, email, password, driver_license, is_admin, created_at)
    values('${id}', 'admin', 'admin@rentx.com', '${password}', '1234567', 'true', 'now()')`
  );

  await connection.close();
}

create().then(() => console.log("Admin user created"));
