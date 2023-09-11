<?php

class ErrorHandler {
	private $Api;

	public function __construct(Api $Api) {
		$this->Api = $Api;
	}

	public function handleError($e, $code){
		$this->Api->response['code'] = $code;
		$this->Api->response['errors'][] = $e->getMessage();
	}
}