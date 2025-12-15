-- ============================================
--  AUTH SERVICE DB  (auth_db)
-- ============================================
CREATE DATABASE IF NOT EXISTS auth_db;
USE auth_db;

-- Users table (for auth-service)
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- --------------------------------------------
-- Chat tables (used by chat-service)
-- --------------------------------------------

CREATE TABLE IF NOT EXISTS chat_groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  owner_id INT NOT NULL,
  join_code VARCHAR(16) NOT NULL UNIQUE,  -- code users can use to join
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_group_members (
  group_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('owner','moderator','member') DEFAULT 'member',
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (group_id, user_id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_id INT NOT NULL,
  sender_id INT NOT NULL,
  text TEXT,
  image_url VARCHAR(1000),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_deleted TINYINT(1) DEFAULT 0,
  deleted_by INT NULL
);

-- ============================================
--  IDEAS SERVICE DB  (ideas_db)
-- ============================================
CREATE DATABASE IF NOT EXISTS ideas_db;
USE ideas_db;

-- Main ideas table (matches ideas.controller + seed-ideas.js)
CREATE TABLE IF NOT EXISTS ideas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  author_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,

  -- time as number of minutes (filtering)
  time_minutes INT NULL,
  -- pretty label: "10–15 min", "40–50 min"
  time_label VARCHAR(50) NULL,

  difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'easy',
  materials TEXT,
  subject VARCHAR(100),  -- e.g. "nature", "math", "language"

  season ENUM('any','spring','summer','autumn','winter') DEFAULT 'any',
  yard_context ENUM('no_green','some_green','green_blue','indoor') DEFAULT 'no_green',

  -- JSON-encoded array of instructions (stringified in Node)
  instructions_json TEXT NULL,

  -- weather constraints used by seeder + filters
  weather ENUM('any','sunny','cloudy','rainy','windy','cold') DEFAULT 'any',

  -- age range (optional)
  min_age INT NULL,
  max_age INT NULL,

  -- card image for frontend
  image_url VARCHAR(1000) NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Comments with optional rating (used in controller as idea_comments)
CREATE TABLE IF NOT EXISTS idea_comments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  idea_id INT NOT NULL,
  user_id INT NOT NULL,
  text TEXT NOT NULL,
  rating TINYINT NULL,  -- 1–5, validated in controller
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Favorites 
CREATE TABLE IF NOT EXISTS idea_favorites (
  user_id INT NOT NULL,
  idea_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, idea_id)
);

-- Tags "Nature", "Recycled", "STEM"
CREATE TABLE IF NOT EXISTS idea_tags (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  idea_id INT NOT NULL,
  tag VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tag_idea (idea_id)
);

-- Categories like "DIY", "Group Project", "Experiment"
CREATE TABLE IF NOT EXISTS idea_categories (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  idea_id INT NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_cat_idea (idea_id)
);

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

-- ============================================
--  PLANNER SERVICE DB  (planner_db)
-- ============================================
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
  idea_id INT NULL,          -- logical link to ideas_db.ideas.id
  custom_title VARCHAR(255),
  custom_description TEXT,
  start_time TIME NULL,
  end_time TIME NULL,
  location VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_plan_id (plan_id)
);

