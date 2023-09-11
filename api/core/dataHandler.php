<?php

class DataHandler {

	private $Api;

	private $parsedRequest;

	public function __construct(Api $Api) {
		$this->Api = $Api;
	}

	public function parseRequest() {
		$request = [];
		$this->Api->debug['process_log'][] = 'DataHandler: Parsing Request';

		$uri = $_SERVER['REQUEST_URI'];

		$request['raw'] = [
			'uri' => $uri
		];

		$request['method'] = $_SERVER['REQUEST_METHOD'];
		$this->Api->debug['process_log'][] = 'DataHandler: Method '.$request['method'];
		$request['params'] = $this->parseUri($uri);
		$this->Api->debug['process_log'][] = 'DataHandler: Request Parsed';

		$request['data'] = $_POST;

		if(($request['method'] == 'PUT' | $request['method'] == 'POST') && empty($_POST)) {
			$request_body = file_get_contents('php://input');
			$request['data'] = (array) json_decode($request_body);
		}

		return $request;
	}

	/*
	 * parseUri
	 *
	 * Creates usable array from $_SERVER['REQUEST_URI']
	 *
	 * @param string $uri should be $_SERVER['REQUEST_URI']
	 * @return array
	 */
	private function parseUri($uri) {
		//Remove "/api/" from beginning of uri;
		$uri = preg_replace('/^\/api\//', '', $uri);
		$uri = rtrim($uri, '/');

		$explodedUri = explode('/', $uri);

		$parsedRequest = [];
		//Cycle through each segment of uri
		foreach($explodedUri as $segKey => $seg) {
			//If seg contains multiple values
			if(strpos($seg, ':') || strpos($seg, ',')){
				$paramArray = [];
				$explodedSeg = explode(',', $seg);

				//Cycle through each value
				foreach($explodedSeg as $key => $param) {
					//Check if value contains param name : param value
					if(strpos($param, ':')){
						$explodedParam = explode(':', $param);

						$key = $explodedParam[0];
						$param = str_replace('+', ' ', $explodedParam[1]);
					}
					$paramArray[$key] = urldecode($param);
				}

				$seg = $paramArray;
			}

			$segKey = $this->validateSegment($segKey, $seg);
			$this->Api->debug['process_log'][] = 'DataHandler: Segment: '.$segKey;
			$this->parsedRequest[$segKey] = $seg;
		}

		$this->validateRequest($this->parsedRequest);

		return $this->parsedRequest;
	}

	/*
	 * validateRequest
	 *
	 * Validates given request data
	 *
	 * @param $request request data
	 * @return void
	 */
	public function validateRequest($request) {
		//Nothing to validate yet
	}


	private function validateSegment($segKey, $seg) {
		if(isset($this->Api->segs[$segKey])) {
			$currentSegValidation = $this->Api->segs[$segKey];
			$validKey = null;

			if(is_array($currentSegValidation)) {
				foreach($currentSegValidation as $validSeg) {
					$methodName = 'validate'.ucfirst($validSeg);
					if($this->$methodName($seg)) {
						$validKey = $validSeg;
					}
				}
			} else {
				$methodName = 'validate'.ucfirst($currentSegValidation);
				if($this->$methodName($seg)) {
					$validKey = $currentSegValidation;
				}
			}

			if($validKey) {
				return $validKey;
			} else {
				throw new Exception('Invalid key: ['.$segKey.'] '.$seg);
			}
		}
	}


	private function validateToken($token) {
		return true;
	}

	private function validateAction($action) {
		$validActions = array_keys($this->Api->actions);
		foreach($validActions as $validAction) {
			if($validAction === $action) {
				return true;
			}
		}
		return false;
	}

	private function validateResource($resource) {
		foreach($this->Api->resources as $validKey => $validResource) {
			if($validKey == $resource) {
				return true;
			}
		}
		return false;
	}

	/*
	 * validateCsv
	 *
	 *  Validates comma separated values
	 *
	 * @param $params array
	 * @return boolean
	 */
	private function validateCsv($params) {
		if(!is_array($params)){
			$temp = $params;
			$params = [];
			$params[0] = $temp;
		}

		end($this->parsedRequest);
		$lastType = key($this->parsedRequest);
		$lastTypeVal = end($this->parsedRequest);
		$lastTypeArray = $lastType.'s';
		$isResource = false;
		switch($lastType) {
			case 'action':
				$validKeys = $this->Api->actions[$lastTypeVal];
				break;
			case 'child':
				$validKeys = $this->Api->types[$this->parsedRequest['child']];
				break;
			case 'resource':
				$isResource = true;
				break;
		}
		if(!$isResource){
			foreach($params as $key => $value) {
				$valid = false;
				$validKeys = !is_array($validKeys) ? [$validKeys] : $validKeys;
				foreach($validKeys as $validKey) {
					if(isset($key) && !is_numeric($key)) {
						if($validKey == $key) {
							$valid = true;
						}
					} else {
						if($validKey == $value) {
							$valid = true;
						}
					}
				}

				if(!$valid) {
					return false;
				}
			}
		}else {
			return false;
		}
		return true;
	}

	private function validateId($id) {
		return is_numeric($id) ? true : false;
	}

	private function validateChild($child) {
		if(isset($this->parsedRequest['id'])){
			$validChildren = $this->Api->resources[$this->parsedRequest['resource']];
			foreach($validChildren as $validKey => $validChild) {
				if(!is_numeric($validKey)){
					if($child == $validKey) {
						return true;
					}
				}else{
					if($child == $validChild) {
						return true;
					}
				}
			}
			return false;
		}else{
			//Return true because validateChild is not needed if no ID has been set
			return false;
		}
	}
}
