<?php

class ThumbGenerator {
	private $Crawler;

	public function __construct($crawler) {
		$this->Crawler = $crawler;

		if(!defined('APP_ROOT'))
			define('APP_ROOT', dirname(dirname(__file__)));

		if(!defined('DS'))
			define('DS', DIRECTORY_SEPARATOR);
	}


	public function fromUrl($url, $id, $type, $generated = false) {
		//Get actual ID if item is generated
		if($generated){
			$result = $this->Crawler->db(sprintf("SELECT id FROM items WHERE gen_id = %d LIMIT 1;", $id), true);
			if(!empty($result)){
				$id = $result[0]['id'];
			} else {
				$this->Crawler->output('No database entry found for: '.$id);
				return false;
			}
		}
		$this->Crawler->output("Generating thumbnail from URL for: ".$id);

		$destinationPath = APP_ROOT.DS.'media'.DS.'thumbs'.DS.$type.DS;
		$relativePath = DS.'media'.DS.'thumbs'.DS.$type.DS;
		$fileName = $id.'.jpg';

		//Check file doesn't exist
		if(file_exists($destinationPath.$fileName)) {
			$this->Crawler->output("Thumbnail already exists in \"".$destinationPath.$fileName."\"");
			return false;
		}

		//Check directory exists
		if(!file_exists($destinationPath)){
			$this->Crawler->output("Creating directory: ".$destinationPath);
			if(!mkdir($destinationPath, 0775, true)){
				$this->Crawler->output('Failed to create directories for thumbnails');
				return false;
			}
		}


		//Fetch file from URL
		$returnedData = $this->Crawler->currentApiClass->apiExec($url, true);
		$rawImage = $returnedData;

		//Save file
		if($rawImage) {
			// $imageSaved = file_put_contents($destinationPath.$fileName, $image);
			$fp = fopen($destinationPath.$fileName, 'x');
			$imageSaved = fwrite($fp, $rawImage);
			fclose($fp);
			if($imageSaved !== false) {
				$this->Crawler->output("Image ".$fileName." saved");
			}
		}

		//Create metadata for item
		if(isset($imageSaved) && $imageSaved !== false) {
			$this->Crawler->output("Saving thumbnail metadata for item: ".$id);
			$value = $relativePath.$fileName;
			$valueLong = 'null';
			if(strlen($value) > 255){
				$valueLong = "\"".$value."\"";
				$value = substr($value, 0, 255);
			}
			$query = sprintf('INSERT INTO item_metadata (`name`, `item`, `value`, `value_long`) VALUES ("%s", %d, "%s", %s);', 'thumb', $id, $value, $valueLong);
			$this->Crawler->db($query);
			$this->Crawler->output("\n");
		}
	}
}
