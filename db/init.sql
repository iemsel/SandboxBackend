-- === AUTH SERVICE DB ===
CREATE DATABASE IF NOT EXISTS auth_db;
USE auth_db;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- === IDEAS SERVICE DB ===
CREATE DATABASE IF NOT EXISTS ideas_db;
USE ideas_db;

CREATE TABLE IF NOT EXISTS ideas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  author_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  time_minutes INT NULL,
  time_label VARCHAR(50) NULL,
  difficulty ENUM('easy','medium','hard') DEFAULT 'easy',
  materials TEXT NULL,
  subject VARCHAR(100) NULL,
  season ENUM('any','spring','summer','autumn','winter') DEFAULT 'any',
  yard_context ENUM('no_green','some_green','green_blue','indoor') DEFAULT 'no_green',
  instructions_json JSON NULL,
  weather ENUM('any','sunny','cloudy','rainy','windy','cold') DEFAULT 'any',
  min_age INT NULL,
  max_age INT NULL,
  image_url VARCHAR(1000) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS idea_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idea_id INT NOT NULL,
  user_id INT NOT NULL,
  text TEXT NOT NULL,
  rating TINYINT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS idea_tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idea_id INT NOT NULL,
  tag VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS idea_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idea_id INT NOT NULL,
  category VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS idea_favorites (
  user_id INT NOT NULL,
  idea_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, idea_id)
);


-- === COLLAB (PLANNING + CHAT) SERVICE DB ===
CREATE DATABASE IF NOT EXISTS collab_db;
USE collab_db;

CREATE TABLE IF NOT EXISTS plans (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  idea_id BIGINT NOT NULL,
  planned_for DATETIME NOT NULL,
  status ENUM('planned','done','cancelled') DEFAULT 'planned',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plan_participants (
  plan_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (plan_id, user_id)
);

CREATE TABLE IF NOT EXISTS chats (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_memberships (
  chat_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  role ENUM('teacher','parent') DEFAULT 'teacher',
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (chat_id, user_id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  chat_id BIGINT NOT NULL,
  sender_user_id BIGINT NOT NULL,
  content TEXT NOT NULL,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Planner DB
CREATE DATABASE IF NOT EXISTS planner_db;
USE planner_db;

CREATE TABLE IF NOT EXISTS plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  class_name VARCHAR(100),
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plan_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plan_id INT NOT NULL,
  idea_id INT NULL,                              -- reference to ideas_db.ideas.id (logical link)
  custom_title VARCHAR(255),
  custom_description TEXT,
  start_time TIME NULL,
  end_time TIME NULL,
  location VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_plan_id (plan_id)
);