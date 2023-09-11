<?php

class Db {
	public $schema = [
		'items' => [
			'fields' => [
				'id' => 'int',
				'name' => 'varchar',
				'type' => 'varchar',
				'parent' => 'int',
				'generated' => 'int',
				'gen_id' => 'int',
				'gen_src' => 'varchar',
				'created' => 'datetime',
				'modified' => 'datetime'
			],
			'childTables' => [
				'metadata' => 'item_metadata',
				'tags' => 'tags',
				'relations' => 'relations'
			]
		],
		'users' => [
			'fields' => [
				'id' => 'int',
				'username' => 'varchar',
				'firstname' => 'varchar',
				'lastname' => 'varchar',
				'password' => 'varchar',
				'salt' => 'varchar',
				'auth' => 'int',
				'created' => 'datetime',
				'modified' => 'datetime'
			],
			'childTables' => [
				'relations' => 'relations',
				'tags' => 'tags'
			]
		],
		'item_metadata' => [
			'fields' => [
				'id' => 'int',
				'item' => 'int',
				'name' => 'varchar',
				'value' => 'varchar',
				'value_long' => 'text',
				'created' => 'datetime',
				'modified' => 'datetime'
			],
		],
		'tags' => [
			'fields' => [
				'id' => 'int',
				'item' => 'int',
				'user' => 'int',
				'name' => 'varchar',
				'created' => 'datetime',
				'modified' => 'datetime'
			]
		],
		'relations' => [
			'fields' => [
				'id' => 'int',
				'user' => 'int',
				'primary_item' => 'int',
				'secondary_item' => 'int',
				'relation_amount' => 'float',
				'created' => 'datetime',
				'modified' => 'datetime'
			]
		]
	];

	public $returnFields = [
		'items' => [
			'id',
			'name',
			'type',
			'parent',
		],
		'users' => [
			'username',
			'firstname',
			'lastname',
			'auth'
		],
		'item_metadata' => [
			'name',
			'value',
			'value_long'
		],
		'tags' => [
			'name'
		],
		'relations' => [
		]
	];

	private $limit = 9;

	private $conn;
	public $Api;

	private $config;

	private $resultData = [];

	public function __construct(Api $Api, $config) {
		$this->Api = $Api;
		$this->config = $config;
	}

	public function connect() {
		try {
			$this->conn = new PDO("mysql:host=".$this->config['host'].";dbname=".$this->config['schema'], $this->config['username'], $this->config['password']);
			$this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->Api->debug['process_log'][] = 'DB: Database Connected';
		} catch(PDOException $e) {
			throw $e;
		}
	}

	/*
	 * prepareAndExecuteQuery
	 *
	 * Converts array of query data into MySQL query, and executes command
	 * Returns array of data, if fetch is true.
	 *
	 * @param $queryData array
	 * @return array or boolean (based on $fetch)
	 */
	public function prepareAndExecuteQuery($queryData) {
		$query = $this->convertToQuery($queryData);
		$fetch = $queryData['statement'] == 'SELECT' ? true : false;
		$this->Api->debug['process_log'][] = 'DB: Query converted and executed';
		return $this->executeQuery($query, $fetch);
	}

	/*
	 * run
	 *
	 * Run the Database core of the API
	 *
	 * @param $request array
	 * @return array
	 */
	public function run($request) {
		$requestData = $request['params'];

		$this->Api->debug['process_log'][] = 'DB: Running DB Core';
		try {
			if(isset($requestData['resource'])){
				if(file_exists(API_PATH.'/db/resources/'.$requestData['resource'].'.php')) {
					include_once(API_PATH.'/db/resources/'.$requestData['resource'].'.php');

					$className = ucfirst($requestData['resource']).'Resource';
				}
			} elseif(isset($requestData['action'])) {
				if(file_exists(API_PATH.'/db/actions/'.$requestData['action'].'.php')) {
					include_once(API_PATH.'/db/actions/'.$requestData['action'].'.php');

					$className = ucfirst($requestData['action']).'Action';
				}
			}
		} catch(Exception $e) {
			$this->Api->debug['process_log'][] = 'DB: Database Missing Files';
			throw new Exception('Cannot find file resource. '.$e);
		}

		try {
			$primary = new $className($this, $request);
		} catch(Exception $e) {
			throw new Exception('Cannot instantiate class for: '.$className.' '.$e);
		}

		$this->Api->debug['process_log'][] = 'DB: Executing '.$className;
		$results = $primary->execute();
		return $results;
	}

	/*
	 * executeQuery
	 *
	 * Simply executes a given query, and returns reponse array
	 *
	 * @param $query string
	 * @return $results array
	 */
	public function executeQuery($query, $fetch=true) {
		$this->Api->debug['process_log'][] = 'DB: Executing Query';
		$exQuery = $this->conn->prepare($query);
		try {
			$queryResult = $exQuery->execute();
			$this->Api->debug['process_log'][] = 'DB: Query done';
		} catch(Exception $e) {
			$this->Api->debug['process_log'][] = 'DB: Query Failed';
			throw new Exception($e);
		}
		if($fetch && $queryResult) {
			$results = $exQuery->fetchAll(PDO::FETCH_ASSOC);
			$this->Api->debug['query_results'][] = $results;
		} else {
			$results = $queryResult;
		}
		return $results;
	}

	/*
	 * convertToQuery
	 *
	 * Convert given data array into query string
	 *
	 * @param $queryData array
	 * @return $query string
	 */
	private function convertToQuery($queryData) {
		$this->Api->debug['process_log'][] = 'DB: Converting query data';
		$query = $queryData['statement'].' ';


		if($queryData['statement'] == 'SELECT') {
			if(isset($queryData['fields'])){
				if(count($queryData['fields']) > 1){
					$fields = implode(', ', $queryData['fields']);
				} else {
					$fields = $queryData['fields'];
				}
				$query .= $fields;
			} else {
				$returnFields = $this->returnFields[$queryData['from']];
				if(!empty($returnFields)){
					foreach($returnFields as &$returnField){
						$returnField = $queryData['from'].'.'.$returnField;
					}
					$fields = implode(',', $returnFields);

					$query .= $fields;
				} else {
					$query .= '*';
				}
			}
		}

		if($queryData['statement'] == 'SELECT') {
			$query .= ' FROM '.$queryData['from'];
		} else {
			$query .= $queryData['from'].' ';
		}

		if($queryData['statement'] == 'UPDATE' && isset($queryData['fields'])) {
			$query .= 'SET ';
			foreach($queryData['fields'] as $key => $field){
				if(isset($queryData['values'][$key])) {
					$value = is_numeric($queryData['values'][$key]) ? $queryData['values'][$key] : $this->conn->quote($queryData['values'][$key]);
					$query .= $field.'='.$value;
				} else {
					throw new Exception('No data given for '.$field);
				}
			}
		}elseif($queryData['statement'] == 'INSERT INTO') {
			$fields = implode(',', $queryData['fields']);
			if(count($queryData['fields']) === count($queryData['values'])) {
				array_walk($queryData['values'], function(&$value){
					$value = is_numeric($value) ? $value : $this->conn->quote($value);
				});
				$values = "(".implode(',', $queryData['values']).")";
			} else {
				throw new Exception('No data given for '.$field);
			}
			$query .= sprintf('(%s) VALUES %s', $fields, $values);
		}elseif($queryData['statement'] == 'DELETE') {

		}

		if(isset($queryData['joins'])) {
			foreach($queryData['joins'] as $join) {
				if(isset($join['type']) && isset($join['on']) && isset($join['table'])) {
					$query .= ' '.strtoupper($join['type']).' JOIN '.$join['table'];

					$query .= ' ON '.$join['on'][0].' = '.$join['on'][1];
				}
			}
		}

		if(isset($queryData['conditions']) && !empty($queryData['conditions'])) {
			$conditionSets = $queryData['conditions'];

			$addSecondary = false;
			foreach($conditionSets as $key => $conditionSet) {
				foreach($conditionSet as $conKey => $condition) {
					$conditionParsed = $condition['col'];


					if($condition['type'] == 'equals'){
						$value = is_numeric($condition['value']) ? $condition['value'] : $this->conn->quote($condition['value']);
						$conditionParsed .= ' = '.$value;
					} elseif($condition['type'] == 'like') {
						$conditionParsed .= ' LIKE "%'.$condition['value'].'%"';
					}
					$conditionSet[$conKey] = $conditionParsed;
				}
				$conditionSet = implode(' && ', $conditionSet);
				$conditionSets[$key] = "(".$conditionSet.")";
			}
			$conditionSets = implode(' || ', $conditionSets);

			$query .= ' WHERE '.$conditionSets;
		}

		$limit = isset($queryData['limit']) ? $queryData['limit'] : $this->limit;
		if($queryData['statement'] == 'SELECT' && $limit != false) {
			$query .= ' LIMIT '.$limit;
		}

		if($queryData['statement'] == 'SELECT' && isset($queryData['offset'])){
			$query .= ' OFFSET '.$queryData['offset'];
		}

		$query .= ';';

		$this->Api->debug['queries'][] = $query;
		$this->Api->debug['process_log'][] = 'DB: Query converted';
		return $query;
	}

	/*
	 * fetchChildTable
	 *
	 * Fetches and sorts child tables
	 *
	 * @param $childTable string, $id int, $resource string
	 * @return $response array
	 */
	public function fetchChildTable($childTable, $id, $resource) {
		$this->Api->debug['process_log'][] = 'DB: Fetching child table';
		if($childTable != 'relations' && $childTable != 'item_metadata') {
			$response = $this->prepareAndExecuteQuery([
				'statement' => 'SELECT',
				'from' => $childTable,
				'conditions' => [[
					[
						'type' => 'equals',
						'col' => $childTable.'.'.substr($resource, 0, -1),
						'value' => $id
					]
				]],
				'limit' => false
			]);
		} elseif($childTable == 'item_metadata') {
			$metadatum = $this->prepareAndExecuteQuery([
				'statement' => 'SELECT',
				'from' => $childTable,
				'conditions' => [[
					[
						'type' => 'equals',
						'col' => $childTable.'.'.substr($resource, 0, -1),
						'value' => $id
					]
				]],
				'limit' => false
			]);
			$response = [];
			foreach($metadatum as $metadata){
				$response[$metadata['name']] = !empty($metadata['value_long']) ? $metadata['value_long'] : $metadata['value'];
			}
		} else {
			$response = $this->executeQuery("
				SELECT
				CASE
				WHEN primary_item != ".$id." THEN primary_item
				WHEN secondary_item != ".$id." THEN secondary_item
				END AS relation_id,
				COUNT(id) AS relation_count,
				ROUND(AVG(relation_amount), 1) AS relation_score
				FROM
				relations
				WHERE
				(relations.primary_item = ".$id.")
				|| (relations.secondary_item = ".$id.")
				GROUP BY relation_id;
			");

			foreach($response as &$relation) {
				$relatedItemId = $relation['relation_id'];

				$relatedItem = $this->prepareAndExecuteQuery([
					'statement' => 'SELECT',
					'from' => 'items',
					'conditions' => [[
						[
							'type' => 'equals',
							'col' => $resource.'.id',
							'value' => $relatedItemId
						]
					]],
					'limit' => false
				]);

				$relatedMetadata = $this->prepareAndExecuteQuery([
					'statement' => 'SELECT',
					'from' => 'item_metadata',
					'conditions' => [[
						[
							'type' => 'equals',
							'col' => 'item_metadata.item',
							'value' => $relatedItemId
						]
					]],
					'limit' => false
				]);
				foreach($relatedMetadata as $metadata){
					$relatedMetadataParsed[$metadata['name']] = !empty($metadata['value_long']) ? $metadata['value_long'] : $metadata['value'];
				}

				$relatedTags = $this->prepareAndExecuteQuery([
					'statement' => 'SELECT',
					'from' => 'tags',
					'conditions' => [[
						[
							'type' => 'equals',
							'col' => 'tags.item',
							'value' => $relatedItemId
						]
					]],
					'limit' => false
				]);

				$relationParsed = [
					'relationId' => $relation['relation_id'],
					'relationCount' => $relation['relation_count'],
					'relationScore' => $relation['relation_score'],
					'item' => [
						'id' => $relatedItem[0]['id'],
						'name' => $relatedItem[0]['name'],
						'type' => $relatedItem[0]['type'],
						'parent' => $relatedItem[0]['parent'],
						'metadata' => $relatedMetadataParsed,
						'tags' => $relatedTags
					]
				];

				$relation = $relationParsed;
			}
		}

		return $response;
	}

	public function generateSalt() {
		$bytes = openssl_random_pseudo_bytes(32);
		$salt = bin2hex($bytes);
		return '$2a$07$'.$salt.'$';
	}

	public function generateHash($password, $salt) {
		return crypt($password, $salt);
	}

	public function createUserSession($remember = false, $username, $auth) {
		session_start();

		$_SESSION['username'] = $username;
		$_SESSION['auth'] = $auth;

		if(isset($remember) && $remember) {
			setrawcookie("sesR", base64_encode($username.$auth),time()+mktime(0,0,0,0,0,5) ,'/',DOMAIN);
		}
	}

	public function destroyUserSession() {
		try {
			session_unset();
			session_destroy();
			session_write_close();
		    setcookie(session_name(),'',0,'/');
		    session_regenerate_id(true);

			if($_COOKIE["sesR"]) {
				$value = base64_encode($_COOKIE["sesR"]);
				setrawcookie("sesR",$value,time()-3600,'/',DOMAIN);
			}
			return true;
		} catch(Exception $e) {
			throw new Exception($e);
			return false;
		}
	}

	public function isLoggedIn($withData = false) {
		if(!$this->isSessionStarted()) {
			session_start();
		}

		if(isset($_COOKIE['sesR']) && $_COOKIE['sesR'] != null || isset($_SESSION['username'])) {
			$userDataCookie = isset($_COOKIE['sesR']) ? base64_decode($_COOKIE['sesR']) : null;
			if($userDataCookie){
				$userData['username'] = substr($userDataCookie, 0, -1);
				$userData['auth'] = substr($userDataCookie, -1);
			} else {
				$userData['auth'] = $_SESSION['auth'];
				$userData['username'] = $_SESSION['username'];
			}

			if(!$this->isSessionStarted()) {
				$this->createUserSession(false, $userData['username'], $userData['auth']);
			}

			if($withData) {
				return $userData;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}

	public function isSessionStarted() {
		if ( php_sapi_name() !== 'cli' ) {
			if ( version_compare(phpversion(), '5.4.0', '>=') ) {
				return session_status() === PHP_SESSION_ACTIVE ? TRUE : FALSE;
			} else {
				return session_id() === '' ? FALSE : TRUE;
			}
		}
		return FALSE;
	}
}
