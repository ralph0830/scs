CREATE TABLE `user_items` (
	`user_id` text NOT NULL,
	`item_id` integer NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	PRIMARY KEY(`user_id`, `item_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `dungeon_monster_spawns`;--> statement-breakpoint
DROP TABLE `dungeon_sessions`;--> statement-breakpoint
DROP TABLE `dungeons`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_dungeon_item_drops` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`area_id` integer NOT NULL,
	`item_id` integer NOT NULL,
	`drop_rate` real DEFAULT 0.05 NOT NULL,
	FOREIGN KEY (`area_id`) REFERENCES `dungeon_areas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_dungeon_item_drops`("id", "area_id", "item_id", "drop_rate") SELECT "id", "area_id", "item_id", "drop_rate" FROM `dungeon_item_drops`;--> statement-breakpoint
DROP TABLE `dungeon_item_drops`;--> statement-breakpoint
ALTER TABLE `__new_dungeon_item_drops` RENAME TO `dungeon_item_drops`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_user_dungeon_progress` (
	`user_id` text NOT NULL,
	`dungeon_id` integer NOT NULL,
	`clear_count` integer DEFAULT 0 NOT NULL,
	`max_distance` integer DEFAULT 0 NOT NULL,
	`total_gold_earned` integer DEFAULT 0 NOT NULL,
	`total_experience_earned` integer DEFAULT 0 NOT NULL,
	`is_unlocked` integer DEFAULT false NOT NULL,
	PRIMARY KEY(`user_id`, `dungeon_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`dungeon_id`) REFERENCES `dungeon_areas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_dungeon_progress`("user_id", "dungeon_id", "clear_count", "max_distance", "total_gold_earned", "total_experience_earned", "is_unlocked") SELECT "user_id", "dungeon_id", "clear_count", "max_distance", "total_gold_earned", "total_experience_earned", "is_unlocked" FROM `user_dungeon_progress`;--> statement-breakpoint
DROP TABLE `user_dungeon_progress`;--> statement-breakpoint
ALTER TABLE `__new_user_dungeon_progress` RENAME TO `user_dungeon_progress`;--> statement-breakpoint
CREATE TABLE `__new_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`image_url` text,
	`type` text DEFAULT 'material' NOT NULL,
	`buy_price` integer,
	`sell_price` integer
);
--> statement-breakpoint
INSERT INTO `__new_items`("id", "name", "description", "image_url", "type", "buy_price", "sell_price") SELECT "id", "name", "description", "image_url", "type", "buy_price", "sell_price" FROM `items`;--> statement-breakpoint
DROP TABLE `items`;--> statement-breakpoint
ALTER TABLE `__new_items` RENAME TO `items`;