CREATE TABLE `critter_skills` (
	`critter_id` integer NOT NULL,
	`skill_id` integer NOT NULL,
	PRIMARY KEY(`critter_id`, `skill_id`),
	FOREIGN KEY (`critter_id`) REFERENCES `critters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `critters` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`emoji` text,
	`image_url` text,
	`base_hp` integer DEFAULT 10 NOT NULL,
	`base_attack` integer DEFAULT 5 NOT NULL,
	`base_defense` integer DEFAULT 5 NOT NULL,
	`hp_growth` real DEFAULT 1.1 NOT NULL,
	`attack_growth` real DEFAULT 1.1 NOT NULL,
	`defense_growth` real DEFAULT 1.1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `dungeon_parties` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text DEFAULT 'Default Party' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `dungeon_party_slots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`party_id` integer NOT NULL,
	`slot_position` integer NOT NULL,
	`user_critter_id` integer,
	FOREIGN KEY (`party_id`) REFERENCES `dungeon_parties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_critter_id`) REFERENCES `user_critters`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`power` integer DEFAULT 10 NOT NULL,
	`type` text DEFAULT 'normal' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_critters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`critter_id` integer NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`hp` integer NOT NULL,
	`attack` integer NOT NULL,
	`defense` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`critter_id`) REFERENCES `critters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`gold` integer DEFAULT 1000 NOT NULL,
	`diamonds` integer DEFAULT 100 NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);