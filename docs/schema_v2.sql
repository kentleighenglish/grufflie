ALTER TABLE `grufflie`.`items` 
	ADD COLUMN `generated` TINYINT NULL AFTER `parent`,
	ADD COLUMN `gen_id` VARCHAR(45) NULL AFTER `generated`,
	ADD COLUMN `gen_src` VARCHAR(255) NULL AFTER `gen_id`,
	ADD UNIQUE INDEX `gen_id_UNIQUE` (`gen_id` ASC);