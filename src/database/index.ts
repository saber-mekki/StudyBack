import { Pool, QueryResult } from "pg";
import env from "dotenv";

env.config();
export const pool = new Pool({
	connectionString:
  process.env.DB_URL,
});

export async function executeSQLQuery(SQL: string,   values: any[] = []
): Promise<QueryResult<any>> {
  return new Promise<QueryResult>((resolve, reject) => {
    pool.query(SQL,values , (error, result) => {
      if (error) {
        return reject(error);
      } else {
        resolve(result);
      }
    });
  });
}


