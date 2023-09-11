<?php
require_once API_PATH."/db/actions.php";

class TypesAction extends Action {

	public function get() {
		$this->Db->Api->debug['process_log'][] = 'DB: Fetching types';
		$requestData = $this->Db->Api->request['params'];

		if(isset($requestData['csv'])) {
			$types = $this->Db->Api->types;
			$values = $requestData['csv'];

			if(!is_array($values)){
				$temp = $values;
				$values = [];
				$values[0] = $temp;
			}

			foreach($values as $value){
				$result[$value] = $types[$value];
			}
		} else {
			$result = array_keys($this->Db->Api->types);
		}

		if(isset($result)) {
			return $result;
		}else {
			return null;
		}

	}

}
