import { env } from "~/src/env";
import mysql from "mysql2/promise";

/**
 * DB接続作成関数
 * DB操作時に接続、クローズをする
 * @returns MySQLの接続オブジェクト
 */
export const createConnection = async () => {
	const connection = await mysql.createConnection({
		host: env.DB_HOST_LOCAL,
		user: env.DB_USER,
		password: env.DB_PASSWORD,
		database: env.DB_NAME,
	});
	return connection;
};

/**
 * DB接続を閉じる関数
 * @param connection 閉じる接続オブジェクト
 */
export const closeConnection = async (connection: mysql.Connection) => {
	await connection.end();
};

/**
 * クエリを実行する関数
 * @param query SQLクエリ
 * @param params クエリパラメータ
 * @returns クエリの結果
 */
export const executeQuery = async <T>(query: string, params?: any[]): Promise<T> => {
	const connection = await createConnection();
	try {
		const [results] = await connection.execute(query, params);
		return results as T;
	} finally {
		await closeConnection(connection);
	}
};

// データベース操作のエクスポート
export const db = {
	query: executeQuery,
	createConnection,
	closeConnection,
};
