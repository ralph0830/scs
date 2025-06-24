CREATE TABLE `dungeon_areas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`min_level` integer DEFAULT 1 NOT NULL,
	`max_level` integer DEFAULT 100 NOT NULL,
	`difficulty` text DEFAULT 'easy' NOT NULL,
	`unlock_requirement` text,
	`background_image` text
);
--> statement-breakpoint
CREATE TABLE `dungeon_item_drops` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`dungeon_id` integer NOT NULL,
	`item_id` integer NOT NULL,
	`drop_rate` real DEFAULT 0.05 NOT NULL,
	`min_distance` integer DEFAULT 0 NOT NULL,
	`max_distance` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`dungeon_id`) REFERENCES `dungeons`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `dungeon_monster_spawns` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`dungeon_id` integer NOT NULL,
	`monster_id` integer NOT NULL,
	`spawn_rate` real DEFAULT 0.15 NOT NULL,
	`min_level` integer DEFAULT 1 NOT NULL,
	`max_level` integer DEFAULT 100 NOT NULL,
	`is_boss` integer DEFAULT false NOT NULL,
	`boss_spawn_condition` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`dungeon_id`) REFERENCES `dungeons`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`monster_id`) REFERENCES `monsters`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `dungeon_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`dungeon_id` integer NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`start_time` integer NOT NULL,
	`end_time` integer,
	`distance_explored` integer DEFAULT 0 NOT NULL,
	`monsters_defeated` integer DEFAULT 0 NOT NULL,
	`items_collected` integer DEFAULT 0 NOT NULL,
	`gold_earned` integer DEFAULT 0 NOT NULL,
	`experience_earned` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`dungeon_id`) REFERENCES `dungeons`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `dungeons` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(100) NOT NULL,
	`description` text(255),
	`image_url` text(255),
	`difficulty` text DEFAULT 'easy' NOT NULL,
	`total_distance` integer DEFAULT 1000 NOT NULL,
	`min_level` integer DEFAULT 1 NOT NULL,
	`max_level` integer DEFAULT 100 NOT NULL,
	`base_gold_reward` integer DEFAULT 100 NOT NULL,
	`base_experience_reward` integer DEFAULT 50 NOT NULL,
	`unlock_requirement` text,
	`is_unlocked` integer DEFAULT false NOT NULL,
	`display_order` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(100) NOT NULL,
	`description` text(255),
	`type` text(50) NOT NULL,
	`rarity` text(50) NOT NULL,
	`image_url` text(255),
	`effect` text(255),
	`price` integer
);
--> statement-breakpoint
CREATE TABLE `monster_skill_assignments` (
	`monster_id` integer NOT NULL,
	`skill_id` integer NOT NULL,
	`level_required` integer DEFAULT 1 NOT NULL,
	PRIMARY KEY(`monster_id`, `skill_id`),
	FOREIGN KEY (`monster_id`) REFERENCES `monsters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`skill_id`) REFERENCES `monster_skills`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `monster_skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`power` integer DEFAULT 10 NOT NULL,
	`type` text DEFAULT 'normal' NOT NULL,
	`cooldown` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `monster_spawns` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`area_id` integer NOT NULL,
	`monster_id` integer NOT NULL,
	`spawn_rate` real DEFAULT 0.1 NOT NULL,
	`min_level` integer DEFAULT 1 NOT NULL,
	`max_level` integer DEFAULT 100 NOT NULL,
	`is_boss` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`area_id`) REFERENCES `dungeon_areas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`monster_id`) REFERENCES `monsters`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `monsters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`emoji` text,
	`image_url` text,
	`type` text DEFAULT 'normal' NOT NULL,
	`base_hp` integer DEFAULT 10 NOT NULL,
	`base_attack` integer DEFAULT 5 NOT NULL,
	`base_defense` integer DEFAULT 5 NOT NULL,
	`hp_growth` real DEFAULT 1.1 NOT NULL,
	`attack_growth` real DEFAULT 1.1 NOT NULL,
	`defense_growth` real DEFAULT 1.1 NOT NULL,
	`rarity` text DEFAULT 'common' NOT NULL,
	`min_level` integer DEFAULT 1 NOT NULL,
	`max_level` integer DEFAULT 100 NOT NULL,
	`experience_reward` integer DEFAULT 10 NOT NULL,
	`gold_reward` integer DEFAULT 5 NOT NULL,
	`drop_rate` real DEFAULT 0.1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `type_matchups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`attacking_type` text NOT NULL,
	`defending_type` text NOT NULL,
	`multiplier` real DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_dungeon_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`dungeon_id` integer NOT NULL,
	`clear_count` integer DEFAULT 0 NOT NULL,
	`total_distance_explored` integer DEFAULT 0 NOT NULL,
	`total_gold_earned` integer DEFAULT 0 NOT NULL,
	`total_experience_earned` integer DEFAULT 0 NOT NULL,
	`best_clear_time` integer,
	`fastest_clear_distance` integer,
	`is_unlocked` integer DEFAULT false NOT NULL,
	`unlocked_at` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`dungeon_id`) REFERENCES `dungeons`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `critters` ADD `type` text DEFAULT 'normal' NOT NULL;