-- ===========================
--  AUTH SERVICE DUMMY DATA
-- ===========================
USE auth_db;

INSERT INTO users (email, name, password_hash) VALUES
('alice@example.com', 'Alice', '$2b$10$abcdefghijklmnopqrstuv123456789012345678901234567890'),
('bob@example.com', 'Bob', '$2b$10$abcdefghijklmnopqrstuv123456789012345678901234567890'),
('charlie@example.com', 'Charlie', '$2b$10$abcdefghijklmnopqrstuv123456789012345678901234567890');


-- ===========================
--  IDEAS SERVICE DUMMY DATA
-- ===========================
USE ideas_db;

-- Ideas
INSERT INTO ideas (author_id, title, description, time_minutes, difficulty, materials, subject, season, yard_context)
VALUES
(1, 'Leaf Art', 'Collect leaves and make nature patterns.', 20, 'easy', 'Leaves, glue, paper', 'nature', 'autumn', 'some_green'),
(2, 'Math Treasure Hunt', 'Solve riddles hidden around the playground.', 30, 'medium', 'Paper, markers', 'math', 'any', 'green_blue'),
(1, 'Indoor Story Circle', 'Kids tell stories using prompts.', 15, 'easy', 'None', 'language', 'winter', 'indoor');

-- Comments
INSERT INTO comments (idea_id, user_id, text)
VALUES
(1, 2, 'Great activity! Kids loved it.'),
(1, 3, 'Used it last week — worked well.'),
(2, 1, 'Trying this in my class next week.');

-- Favorites
INSERT INTO idea_favorites (user_id, idea_id)
VALUES
(1, 1),
(1, 2),
(2, 1),
(3, 3);


-- ===========================
--  COLLAB SERVICE DUMMY DATA
-- ===========================
USE collab_db;

-- Plans
INSERT INTO plans (user_id, idea_id, planned_for, status)
VALUES
(1, 1, '2025-03-10 10:00:00', 'planned'),
(2, 2, '2025-03-12 14:30:00', 'done');

-- Plan Participants
INSERT INTO plan_participants (plan_id, user_id)
VALUES
(1, 2),
(1, 3),
(2, 1);

-- Chats
INSERT INTO chats (name)
VALUES
('Parent Group A'),
('Teacher Team Room');

-- Chat Memberships
INSERT INTO chat_memberships (chat_id, user_id, role)
VALUES
(1, 1, 'parent'),
(1, 2, 'parent'),
(2, 1, 'teacher'),
(2, 3, 'teacher');

-- Chat Messages
INSERT INTO chat_messages (chat_id, sender_user_id, content)
VALUES
(1, 1, 'Hi everyone! Excited for the activity.'),
(1, 2, 'Same here! Let me know how I can help.'),
(2, 3, 'Reminder: team meeting at 3 PM today.');


-- ===========================
--  PLANNER SERVICE DUMMY DATA
-- ===========================
USE planner_db;

-- Plans
INSERT INTO plans (owner_id, title, date, class_name, notes)
VALUES
(1, 'Nature Learning Day', '2025-03-15', 'Class A', 'Outdoor activities focusing on nature'),
(2, 'Math Workshop', '2025-03-20', 'Group B', 'Fun indoor math challenges');

-- Plan Items
INSERT INTO plan_items (plan_id, idea_id, custom_title, custom_description, start_time, end_time, location)
VALUES
(1, 1, NULL, NULL, '10:00:00', '10:30:00', 'School Yard'),
(1, NULL, 'Healthy Snack Break', 'Fruits and water', '10:30:00', '10:45:00', 'Cafeteria'),
(2, 2, NULL, NULL, '13:00:00', '14:00:00', 'Room 105'),
(2, 3, 'Story Time', 'Storytelling session with kids', '14:00:00', '14:30:00', 'Library');
