ALTER TABLE posts
ADD COLUMN author_name VARCHAR(255) DEFAULT 'الأستاذ ياسين',
ADD COLUMN author_avatar VARCHAR(255) DEFAULT '/assets/yassine-image-DgfyHuCr.png',
ADD COLUMN sections JSON DEFAULT NULL;

-- Optional: Update existing records to have default values if needed
UPDATE posts SET views = 0 WHERE views IS NULL;
UPDATE posts SET author_avatar = '/assets/yassine-image-DgfyHuCr.png' WHERE author_avatar IS NULL;
