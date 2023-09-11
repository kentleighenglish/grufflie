ALTER TABLE `item_metadata` 
CHANGE COLUMN `value` `value` VARCHAR(255) NOT NULL ,
CHANGE COLUMN `value_long` `value_long` MEDIUMTEXT NULL DEFAULT NULL ;