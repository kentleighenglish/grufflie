<?php
class Action {

	protected $Db;

	protected $request;

	public function __construct(Db $Db, $request=null) {
		$this->Db = $Db;
		$this->request = $request;
	}

	public function execute() {
		$method = $this->request['method'];

		if($method == 'GET'){
			return $this->get();
		}elseif($method == 'POST' && isset($_POST) && !empty($_POST)) {
			return $this->post();
		}elseif($method == 'PUT' && isset($_POST) && !empty($_POST)) {
			return $this->put();
		}
	}

	// private function buildResourceAction($requestData) {
	// 	$action = $requestData['action'];
	// 	$methodName = 'action'.ucfirst($action);
	// 	$this->$methodName($requestData);
	// }

}
