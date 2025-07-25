import mysql from 'mysql2/promise';

async function initDatabase() {
	const config = {
		host: process.env.DB_HOST_LOCAL || 'localhost',
		user: process.env.DB_USER || 'root',
		password: process.env.DB_PASSWORD || 'tommypassword',
		database: process.env.DB_NAME || 'matcha_db'
	};

	try {
		// まず、データベース名を指定しないで接続
		const connection = await mysql.createConnection({
			host: config.host,
			user: config.user,
			password: config.password
		});

		console.log('Connected to MySQL server');

		// データベースが存在しない場合は作成
		await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
		console.log(`Database '${config.database}' created or already exists`);

		// データベースを選択
		await connection.query(`USE ${config.database}`);

		// テーブル作成のSQL（各テーブルを個別に実行）
		const createTablesSQL = [
			`CREATE TABLE IF NOT EXISTS users (
				id INT AUTO_INCREMENT PRIMARY KEY,
				email VARCHAR(255) UNIQUE NOT NULL,
				username VARCHAR(100) UNIQUE NOT NULL,
				first_name VARCHAR(100) NOT NULL,
				last_name VARCHAR(100) NOT NULL,
				password_hash VARCHAR(255) NOT NULL,
				is_verified BOOLEAN DEFAULT FALSE,
				gender ENUM('male', 'female', 'other') NOT NULL,
				sexual_preference ENUM('male', 'female', 'both') NOT NULL,
				biography TEXT,
				fame_rating FLOAT DEFAULT 0,
				latitude FLOAT,
				longitude FLOAT,
				location_updated_at DATETIME,
				last_login DATETIME,
                birth_date DATETIME,
				is_online BOOLEAN DEFAULT FALSE,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				INDEX idx_location (latitude, longitude),
				INDEX idx_fame_rating (fame_rating)
			)`,

			`CREATE TABLE IF NOT EXISTS interest_tags (
				id INT AUTO_INCREMENT PRIMARY KEY,
				name VARCHAR(100) UNIQUE NOT NULL,
				icon VARCHAR(100) NOT NULL
			)`,

			`CREATE TABLE IF NOT EXISTS users_interest_tags_map (
				user_id INT,
				tag_id INT,
				PRIMARY KEY (user_id, tag_id),
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (tag_id) REFERENCES interest_tags(id) ON DELETE CASCADE
			)`,

			`CREATE TABLE IF NOT EXISTS photos (
				id INT AUTO_INCREMENT PRIMARY KEY,
				user_id INT NOT NULL,
				url VARCHAR(500) NOT NULL,
				is_profile BOOLEAN DEFAULT FALSE,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
			)`,

			`CREATE TABLE IF NOT EXISTS likes (
				id INT AUTO_INCREMENT PRIMARY KEY,
				from_user_id INT NOT NULL,
				to_user_id INT NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
				UNIQUE KEY unique_like (from_user_id, to_user_id)
			)`,

			`CREATE TABLE IF NOT EXISTS matches (
				id INT AUTO_INCREMENT PRIMARY KEY,
				user1_id INT NOT NULL,
				user2_id INT NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
				UNIQUE KEY unique_match (user1_id, user2_id),
				CHECK (user1_id < user2_id)
			)`,

			`CREATE TABLE IF NOT EXISTS messages (
				id INT AUTO_INCREMENT PRIMARY KEY,
				match_id INT NOT NULL,
				sender_id INT NOT NULL,
				content TEXT NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
				FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
				INDEX idx_match_created (match_id, created_at)
			)`,

			`CREATE TABLE IF NOT EXISTS profile_views (
				id INT AUTO_INCREMENT PRIMARY KEY,
				viewer_id INT NOT NULL,
				viewed_id INT NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (viewer_id) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (viewed_id) REFERENCES users(id) ON DELETE CASCADE
			)`,

			`CREATE TABLE IF NOT EXISTS blocks (
				id INT AUTO_INCREMENT PRIMARY KEY,
				blocker_id INT NOT NULL,
				blocked_id INT NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE,
				UNIQUE KEY unique_block (blocker_id, blocked_id)
			)`,

			`CREATE TABLE IF NOT EXISTS reports (
				id INT AUTO_INCREMENT PRIMARY KEY,
				reporter_id INT NOT NULL,
				reported_id INT NOT NULL,
				reason TEXT NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (reported_id) REFERENCES users(id) ON DELETE CASCADE
			)`,

			`CREATE TABLE IF NOT EXISTS notifications (
				id INT AUTO_INCREMENT PRIMARY KEY,
				user_id INT NOT NULL,
				type ENUM('like', 'view', 'message', 'match', 'unlike', 'report') NOT NULL,
				content TEXT,
				is_read BOOLEAN DEFAULT FALSE,
				related_user_id INT,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (related_user_id) REFERENCES users(id) ON DELETE SET NULL,
				INDEX idx_user_read (user_id, is_read)
			)`,

			`CREATE TABLE IF NOT EXISTS search_filters (
				id INT AUTO_INCREMENT PRIMARY KEY,
				user_id INT UNIQUE,
				min_age INT,
				max_age INT,
				min_fame_rating FLOAT,
				max_fame_rating FLOAT,
				location VARCHAR(255),
				max_distance INT DEFAULT 50,
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
			)`,

			`CREATE TABLE IF NOT EXISTS verification_tokens (
				id INT AUTO_INCREMENT PRIMARY KEY,
				user_id INT NOT NULL,
				token VARCHAR(255) NOT NULL,
				expired_at DATETIME NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
			)`,

			`CREATE TABLE IF NOT EXISTS sessions (
				id INT AUTO_INCREMENT PRIMARY KEY,
				session_token VARCHAR(255) UNIQUE NOT NULL,
				user_id INT NOT NULL,
				expires DATETIME NOT NULL,
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
			)`,

			`CREATE TABLE IF NOT EXISTS accounts (
				id INT AUTO_INCREMENT PRIMARY KEY,
				user_id INT NOT NULL,
				type VARCHAR(255) NOT NULL,
				provider VARCHAR(255) NOT NULL,
				provider_account_id VARCHAR(255) NOT NULL,
				refresh_token TEXT,
				access_token TEXT,
				expires_at BIGINT,
				token_type VARCHAR(255),
				scope VARCHAR(255),
				id_token TEXT,
				session_state VARCHAR(255),
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
				UNIQUE KEY unique_provider_account (provider, provider_account_id)
			)`,

			`CREATE TABLE IF NOT EXISTS password_reset_tokens (
				id INT AUTO_INCREMENT PRIMARY KEY,
				user_id INT NOT NULL,
				token VARCHAR(255) NOT NULL,
				expired_at DATETIME NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
			)`
		];

		// テーブル作成の実行（各テーブルを個別に実行）
		for (const sql of createTablesSQL) {
			await connection.query(sql);
		}
		console.log("Database tables created successfully");

		// サンプルデータの挿入
		const insertSampleDataSQL = [
			// タグのサンプルデータ（名前と絵文字）
			`INSERT IGNORE INTO interest_tags (name, icon) VALUES 
				('スポーツ', '⚽'), ('音楽', '🎵'), ('映画', '🎬'), ('読書', '📚'), ('旅行', '✈️'), 
				('料理', '🍳'), ('ゲーム', '🎮'), ('アート', '🎨'), ('写真', '📷'), ('ダンス', '💃'),
				('ヨガ', '🧘'), ('ランニング', '🏃'), ('サイクリング', '🚴'), ('スキー', '⛷️'), ('サーフィン', '🏄'),
				('テニス', '🎾'), ('ゴルフ', '⛳'), ('バスケットボール', '🏀'), ('サッカー', '⚽'), ('野球', '⚾')`,
			
			// テストユーザーの挿入
			`INSERT IGNORE INTO users (email, username, password_hash, first_name, last_name, gender, sexual_preference, birth_date, is_verified) VALUES
			('test@example.com', 'testuser', 'password123', 'Test', 'User', 'male', 'female', '1990-01-01', true),
			('saintyoungmen1124+test4@gmail.com', 'testuser2', 'password123', 'Test', 'User2', 'male', 'female', '1990-01-01', true)`,
		];

		// サンプルデータの挿入実行
		for (const sql of insertSampleDataSQL) {
			await connection.query(sql);
		}
		console.log("Sample data inserted successfully");

		await connection.end();
		console.log("Database initialization completed successfully");

	} catch (error) {
		console.error("Error initializing database:", error);
		process.exit(1);
	}
}

// スクリプトが直接実行された場合のみ実行
if (import.meta.url === `file://${process.argv[1]}`) {
	initDatabase();
}

export { initDatabase }; 