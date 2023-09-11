CREATE TABLE `grufflie`.`items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `parent` INT NULL,
  `created` DATETIME NOT NULL,
  `modified` DATETIME NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `grufflie`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `firstname` VARCHAR(255) NULL,
  `lastname` VARCHAR(255) NULL,
  `password` VARCHAR(255) NOT NULL,
  `created` DATETIME NOT NULL,
  `modified` DATETIME NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `grufflie`.`item_metadata` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `item` INT NOT NULL,
  `name` VARCHAR(255) NULL,
  `value` VARCHAR(255) NULL,
  `value_long` TEXT NOT NULL,
  `created` DATETIME NOT NULL,
  `modified` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_metadata_item_idx` (`item` ASC),
  CONSTRAINT `fk_metadata_item`
    FOREIGN KEY (`item`)
    REFERENCES `grufflie`.`items` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


CREATE TABLE `grufflie`.`tags` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `item` INT NOT NULL,
  `user` INT NOT NULL,
  `name` VARCHAR(255) NULL,
  `created` DATETIME NOT NULL,
  `modified` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_tags_item_idx` (`item` ASC),
  CONSTRAINT `fk_tags_item`
    FOREIGN KEY (`item`)
    REFERENCES `grufflie`.`items` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  INDEX `fk_tags_user_idx` (`user` ASC),
  CONSTRAINT `fk_tags_user`
    FOREIGN KEY (`user`)
    REFERENCES `grufflie`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);

CREATE TABLE `grufflie`.`relations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user` INT NOT NULL,
  `primary_item` INT NOT NULL,
  `secondary_item` INT NOT NULL,
  `relation_amount` FLOAT NULL,
  `created` DATETIME NOT NULL,
  `modified` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_relations_item1_idx` (`primary_item` ASC),
  CONSTRAINT `fk_relations_item1`
    FOREIGN KEY (`primary_item`)
    REFERENCES `grufflie`.`items` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  INDEX `fk_relations_item2_idx` (`secondary_item` ASC),
  CONSTRAINT `fk_relations_item2`
    FOREIGN KEY (`secondary_item`)
    REFERENCES `grufflie`.`items` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);