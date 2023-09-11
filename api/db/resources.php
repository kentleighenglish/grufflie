<?php

class Resource {

	protected $Db;

	protected $request;

	public function __construct(Db $Db, $request=null) {
		$this->Db = $Db;
		$this->request = $request;
	}

	public function execute() {
		$method = $this->request['method'];
		$data = $this->request['data'];
		$this->Db->Api->debug['process_log'][] = 'DB: Getting Child Data';


		if($method == 'GET'){
			return $this->get();
		}elseif($method == 'POST' && !empty($data)) {
			return $this->post();
		}elseif($method == 'PUT' && !empty($data)) {
			return $this->put();
		}
		$this->Db->Api->debug['process_log'][] = 'DB: Could not run resource execute';
	}

}
