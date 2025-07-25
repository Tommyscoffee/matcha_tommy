import mysql from 'mysql2/promise';

async function resetDatabase() {
	const config = {
		host: process.env.DB_HOST_LOCAL || 'localhost',
		user: process.env.DB_USER || 'root',
		password: process.env.DB_PASSWORD || 'tommypassword',
		database: process.env.DB_NAME || 'matcha_db'
	};

	try {
		// データベース名を指定しないで接続
		const connection = await mysql.createConnection({
			host: config.host,
			user: config.user,
			password: config.password
		});

		console.log('Connected to MySQL server');

		// データベースを削除して再作成
		await connection.query(`DROP DATABASE IF EXISTS ${config.database}`);
		console.log(`Database '${config.database}' dropped`);
		
		await connection.query(`CREATE DATABASE ${config.database} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
		console.log(`Database '${config.database}' recreated`);

		await connection.end();
		console.log("Database reset completed successfully");

	} catch (error) {
		console.error("Error resetting database:", error);
		process.exit(1);
	}
}

// スクリプトが直接実行された場合のみ実行
if (import.meta.url === `file://${process.argv[1]}`) {
	resetDatabase();
}

export { resetDatabase }; 