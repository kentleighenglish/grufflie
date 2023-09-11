<?php
include "dataHandler.php";
include "errorHandler.php";
include "db.php";

class Api {

	public $request;
	public $response = [];
	public $debug = [];

	public $segs = [
		['resource', 'action'],
		['id', 'csv'],
		['child'],
		['csv']
	];

	public $resources = [
		'items' => [
			'metadata',
			'relations',
			'tags'
		],
		'users' => [
			'username',
			'firstname',
			'lastname',
			'password'

		]
	];

	public $actions = [
		'filter' => [
			'tag',
			'query',
			'type',
			'limit',
			'offset'
		],
		'types' => [
			'artist',
			'album',
			'song'
		],
		'checkUsername' => [
			'value'
		],
		'passwordStrength' => [
			'username',
			'firstname',
			'lastname',
			'email',
			'emailConfirm',
			'password',
			'passwordConfirm'

		],
		'login' => [
			'username',
			'password',
			'remember'
		],
		'logout' => [],
		'loggedIn' => []
	];

	public $types = [
		'artist' => [
			'metadata' => [
				[
					'name' => 'description',
					'type' => 'textarea',
					'label' => 'Bio',
					'empty' => 'No bio'
				],
				[
					'name' => 'website',
					'type' => 'url',
					'label' => 'Website'
				],
				[
					'name' => 'social',
					'type' => 'social'
				],
				[
					'name' => 'albums',
					'type' => 'child',
					'item_type' => 'album',
					'label' => 'Albums',
					'empty' => 'No albums'
				]

			]
		],
		'album' => [
			'metadata' => [
				'released' => [
					'type' => 'date',
					'label' => 'Released'
				],
				'tracklist' => [
					'type' => 'child',
					'item_type' => 'song',
					'label' => 'Tracks'
				]
			]
		],
		'song' => [
			'metadata' => [
				'description' => []
			]
		]
	];


	public $DataHandler;
	public $ErrorHandler;
	public $Db;

	public function __construct($dbConfig) {
		$this->response['code'] = '200';
		$this->debug['process_log'][] = 'API INIT';

		$this->DataHandler = new DataHandler($this);
		$this->ErrorHandler = new ErrorHandler($this);
		$this->Db = new Db($this, $dbConfig);

		try {
			$this->request = $this->DataHandler->parseRequest();

			$this->debug['request'] = $this->request;
			//Database request
			$this->Db->connect();
			$results = $this->Db->run($this->request);
		} catch (Exception $e) {
			$this->ErrorHandler->handleError($e, 400);
		}

		if(isset($results)){
			$this->response['success'] = $results;
		}

		$loggedIn = $this->Db->isLoggedIn();
		if($loggedIn != false) {
			$this->response['loggedIn'] = $loggedIn;
		}

		if(TEST_ENVIRONMENT)
			$this->response['debug'] = $this->debug;

		$this->respond();
	}

	public function respond() {
		http_response_code($this->response['code']);

		header('Content-Type: application/json');
		array_walk_recursive($this->response, function(&$param){
			if(is_string($param)) {
				$param = utf8_encode($param);
			}
		});
		echo json_encode($this->response);
		die();
	}

}
