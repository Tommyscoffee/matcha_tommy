import { env } from "~/src/env";
import mysql from "mysql2/promise";

/**
 * データベースの初期化とテーブル作成を行う関数
 */
export const initializeDatabase = async () => {
	const connection = await createConnection();
	try {
		// テーブル作成のSQL
		const createTablesSQL = `
			-- ユーザーテーブル
			CREATE TABLE IF NOT EXISTS users (
				id INT AUTO_INCREMENT PRIMARY KEY,
				email VARCHAR(255) UNIQUE NOT NULL,
				username VARCHAR(50) UNIQUE NOT NULL,
				password VARCHAR(255) NOT NULL,
				first_name VARCHAR(50) NOT NULL,
				last_name VARCHAR(50) NOT NULL,
				gender ENUM('male', 'female', 'other') NOT NULL,
				sexual_preference ENUM('male', 'female', 'both') NOT NULL,
				biography TEXT,
				profile_picture VARCHAR(255),
				latitude DECIMAL(10, 8),
				longitude DECIMAL(11, 8),
				fame_rating INT DEFAULT 0,
				is_verified BOOLEAN DEFAULT FALSE,
				is_online BOOLEAN DEFAULT FALSE,
				last_seen DATETIME,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
			);

			-- ユーザーの写真テーブル
			CREATE TABLE IF NOT EXISTS user_photos (
				id INT AUTO_INCREMENT PRIMARY KEY,
				user_id INT NOT NULL,
				photo_url VARCHAR(255) NOT NULL,
				is_profile_picture BOOLEAN DEFAULT FALSE,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
			);

			-- タグテーブル
			CREATE TABLE IF NOT EXISTS tags (
				id INT AUTO_INCREMENT PRIMARY KEY,
				name VARCHAR(50) UNIQUE NOT NULL
			);

			-- ユーザーとタグの関連テーブル
			CREATE TABLE IF NOT EXISTS user_tags (
				user_id INT NOT NULL,
				tag_id INT NOT NULL,
				PRIMARY KEY (user_id, tag_id),
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
			);

			-- いいねテーブル
			CREATE TABLE IF NOT EXISTS likes (
				id INT AUTO_INCREMENT PRIMARY KEY,
				liker_id INT NOT NULL,
				liked_id INT NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (liker_id) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (liked_id) REFERENCES users(id) ON DELETE CASCADE,
				UNIQUE KEY unique_like (liker_id, liked_id)
			);

			-- プロフィール閲覧履歴テーブル
			CREATE TABLE IF NOT EXISTS profile_views (
				id INT AUTO_INCREMENT PRIMARY KEY,
				viewer_id INT NOT NULL,
				viewed_id INT NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (viewer_id) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (viewed_id) REFERENCES users(id) ON DELETE CASCADE
			);

			-- ブロックテーブル
			CREATE TABLE IF NOT EXISTS blocks (
				id INT AUTO_INCREMENT PRIMARY KEY,
				blocker_id INT NOT NULL,
				blocked_id INT NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE,
				UNIQUE KEY unique_block (blocker_id, blocked_id)
			);

			-- チャットメッセージテーブル
			CREATE TABLE IF NOT EXISTS messages (
				id INT AUTO_INCREMENT PRIMARY KEY,
				sender_id INT NOT NULL,
				receiver_id INT NOT NULL,
				content TEXT NOT NULL,
				is_read BOOLEAN DEFAULT FALSE,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
			);

			-- 通知テーブル
			CREATE TABLE IF NOT EXISTS notifications (
				id INT AUTO_INCREMENT PRIMARY KEY,
				user_id INT NOT NULL,
				type ENUM('like', 'view', 'message', 'match', 'unlike') NOT NULL,
				related_user_id INT,
				content TEXT,
				is_read BOOLEAN DEFAULT FALSE,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (related_user_id) REFERENCES users(id) ON DELETE SET NULL
			);

			-- パスワードリセットトークンテーブル
			CREATE TABLE IF NOT EXISTS password_reset_tokens (
				id INT AUTO_INCREMENT PRIMARY KEY,
				user_id INT NOT NULL,
				token VARCHAR(255) NOT NULL,
				expires_at DATETIME NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
			);

			-- アカウント検証トークンテーブル
			CREATE TABLE IF NOT EXISTS verification_tokens (
				id INT AUTO_INCREMENT PRIMARY KEY,
				user_id INT NOT NULL,
				token VARCHAR(255) NOT NULL,
				expires_at DATETIME NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
			);
		`;

		// テーブル作成の実行
		await connection.query(createTablesSQL);
		console.log("Database tables created successfully");
	} catch (error) {
		console.error("Error creating database tables:", error);
		throw error;
	} finally {
		await closeConnection(connection);
	}
};

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
	initializeDatabase,
};
