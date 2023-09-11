<?php
	include_once(dirname(dirname(__file__)).'/api/core/db_config.php');

	class Crawler {
		private $apis = [];
		private $db_config = [];

		public $conn;
		public $args = [];
		public $currentApi;
		public $currentApiClass;
		public $saveArtistList = [];
		public $thumbs = [];


		private $validArgs = [
			'prompt' => [
				'symbols' => ['-p', '--prompt'],
				'value' => false
			],
			'readonly' => [
				'symbols' => ['-r', '--readonly'],
				'value' => false
			],
			'api' => [
				'symbols' => ['-a', '--api'],
				'value' => true
			],
			'quiet' => [
				'symbols' => ['-q', '--quiet'],
				'value' => false
			]
		];

		public function __construct($args, $db_config) {

			if(!defined('APP_ROOT'))
				define('APP_ROOT', dirname(dirname(__file__)));

			if(!defined('DS'))
				define('DS', DIRECTORY_SEPARATOR);


			//Lovely empty line to start us off
			echo "\n";
			$this->db_config = $db_config;

			$this->parseArguments($args);

			if(!isset($this->args['readonly'])) {
				try {
					$this->conn = new PDO("mysql:host=".$this->db_config['host'].";dbname=".$this->db_config['schema'], $this->db_config['username'], $this->db_config['password']);
					$this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
					$this->conn->exec("set names utf8");
				} catch(PDOException $e) {
					throw $e;
				}
			}

			$this->init();

		}

		public function output($message) {
			if(!isset($this->args['quiet'])) {
				echo $message."\n";
			}
		}

		/*
		 * Initialises the Crawler
		 */
		public function init() {
			//Fetch existing API integration files
			$this->output("Fetching API scripts");
			$apiFiles = array_slice( scandir(APP_ROOT.DS.'vendor'.DS.'apis'.DS), 2);

			$this->output(count($apiFiles ) > 1 ? "Found ".count($apiFiles)." API scripts" : "Found 1 API script");

			$apiFiles = preg_filter("/\.[^\.]*$/", "", $apiFiles);


			if(isset($this->args['prompt'])){
				if(isset($this->args['api'])){

				} else {
					//Prompt the user to select an API
					$continue = true;
					while($continue){
						echo "\n";
						foreach($apiFiles as $key => $apiFile) {
							echo "[".($key+1)."] $apiFile\n";
						}
						echo "Press 0 to crawl all APIs\n";
						$selectedApi = readline("Select an API to crawl (1, 2..): ");
						if(isset($apiFiles[$selectedApi-1])){
							$continue = false;
						} else {
							echo "Invalid API selected\n\n";
						}
					}

					$this->currentApi = $apiFiles[$selectedApi-1];
					$this->output("Running API: ".ucfirst($this->currentApi));
					$this->crawlApi($this->currentApi);
				}
			} else {
				foreach($apiFiles as $key => $currentApi) {
					$this->currentApi = $currentApi;
					$this->output("Running API: ".ucfirst($currentApi)." (".($key+1)." of ".count($apiFiles).")");
					$this->crawlApi($this->currentApi);
				}
			}
		}

		private function crawlApi($apiFileName) {
			$apiClassName = ucfirst($apiFileName).'Crawler';

			include_once(APP_ROOT.DS.'vendor'.DS.'/apis/'.$apiFileName.'.php');

			if(class_exists($apiClassName)) {
				$this->currentApiClass = new $apiClassName($this);
				$this->currentApiClass->crawl();
			} else {
				throw new Exception("Class for API \"".ucfirst($apiFileName)."\" does not exist");
			}
		}

		private function parseArguments($args) {
			//Remove reference to current script file
			array_shift($args);

			foreach($args as $arg) {
				unset($symbol);
				unset($value);

				//Begins with "-"
				if(preg_match('/^-+/', $arg)){
					$dashCount = substr_count($arg, '-');

					if($dashCount <= 2){
						if($dashCount == 2){
							if(substr_count($arg, '=')){
								$explode = explode('=', $arg);
								$symbol = $explode[0];
								$value = $explode[1];
							} else {
								$symbol = $arg;
							}
						}else{
							if(strlen($arg) > 2){
								$symbol = substr($arg, 0, 2);
								$value = substr_replace($arg, '', 0, 2);
							} else {
								$symbol = $arg;
							}
						}
					} else {
						throw new Exception($arg." is not a valid argument");
					}

					$valid = false;
					foreach($this->validArgs as $name => $validArg){
						$validSymbols = $validArg['symbols'];
						$takesValue = $validArg['value'];
						foreach($validSymbols as $validSymbol){
							if($validSymbol == $symbol) {
								$valid = true;
								if(isset($value) == $takesValue){
									if($takesValue){
										$this->args[$name] = $value;
									} else {
										$this->args[$name] = true;
									}
									break;
								} else {
									if($takesValue){
										throw new Exception($symbol." requires a value");
									} else {
										throw new Exception($symbol." does not take a value");
									}
								}
							}
						}
					}

					if(!$valid) {
						throw new Exception($symbol." is not a valid parameter");
					}
				} else {
					throw new Exception($arg." is not a valid argument");
				}
			}
		}

		public function db($query, $return = false) {
			if(!isset($this->args['readonly'])){
				$exQuery = $this->conn->prepare($query);
				try {
					$exQuery->execute();

				} catch(Exception $e) {
					throw new Exception($e);
				}

				if($return){
					$results = $exQuery->fetchAll(PDO::FETCH_ASSOC);
					return $results;
				}
			} else {
				return null;
			}
		}

		public function validates($item) {
			//Fetch possible existing item from database
			$existingItem = $this->db("
				SELECT items.id
				FROM `items`
				WHERE items.generated = 1
				AND items.gen_src = '".$this->currentApi."'
				AND items.gen_id = ".$item['gen_id']."
			");

			return empty($existingItem);
		}

		public function saveArtist($item) {
			array_push($this->saveArtistList, $item);
		}

		public function saveAllArtists() {
			$values = '';
			foreach($this->saveArtistList as $key => $artist){
				$name = $this->conn->quote($artist['name']);
				$values .= "(".$name.", 'artist', 1, ".$artist['gen_id'].", '".$this->currentApi."')";

				if($key+1 != count($this->saveArtistList)){
					$values .= ", ";
				}

				if(!empty($artist['thumb'])) {
					$this->thumbs[$artist['gen_id']] = $artist['thumb'];
				}
			}
			$query = "
				INSERT INTO `items` (`name`, `type`, `generated`, `gen_id`, `gen_src`)
				VALUES
				".$values."
				ON DUPLICATE KEY UPDATE gen_id=gen_id;";

			$this->output("Saving ".count($this->saveArtistList)." artists to database");
			$response = $this->db($query);

			$this->generateThumbs();

			$this->saveArtistList = [];
		}


		public function generateThumbs() {
			include_once(APP_ROOT.DS.'vendor'.DS.'thumbGenerator.php');
			$thumbGen = new ThumbGenerator($this);
			foreach($this->thumbs as $id => $thumb) {
				$thumbGen->fromUrl($thumb, $id, 'artists', true);
			}
			$this->thumbs = [];
		}

	}


	//Instatiate Crawler
	try {
		$crawler = new Crawler($argv, $crawler_db);
	} catch(Exception $e) {
		echo "Error: ".$e->getMessage()."\n";
		echo "Crawler aborted\n";
		die();
	}
?>
