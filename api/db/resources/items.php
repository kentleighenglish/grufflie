<?php
include_once API_PATH."/db/resources.php";

class ItemsResource extends Resource {

	public function get() {
		$this->Db->Api->debug['process_log'][] = 'DB: Running GET';
		$requestData = $this->request['params'];

		if(!isset($requestData['child'])) {
			$result = $this->getSimple($requestData);
		} else {
			$result = $this->getChild($requestData);
		}

		return $result;
	}

	public function put() {
		$this->Db->Api->debug['process_log'][] = 'DB: Running PUT';
		$requestData = $this->request['params'];
		$postData = $this->request['data'];

		if(!isset($requestData['child'])) {
			$result = $this->saveSimple($requestData, $postData);
		}else {
			$result = $this->saveChild($requestData, $postData);
		}

		return $result;
	}


	public function post() {
		$this->Db->Api->debug['process_log'][] = 'DB: Running POST';
		$requestData = $this->request['params'];
		$postData = $this->request['data'];

		if(!isset($requestData['child'])) {
			$result = $this->createSimple($requestData, $postData);
		}else {
			$result = $this->createChild($requestData, $postData);
		}

		return $result;
	}

	private function getSimple($requestData) {
		$this->Db->Api->debug['process_log'][] = 'DB: Getting simple Item';
		$resource = $requestData['resource'];

		$queryData['statement'] = 'SELECT';
		$queryData['from'] = $resource;

		if(isset($requestData['id'])) {
			$queryData['conditions'][] = [
				[
					'type' => 'equals',
					'col' => "$resource.id",
					'value' => $requestData['id']
				]
			];
		}

		$items = $this->Db->prepareAndExecuteQuery($queryData);

		foreach($items as $key => $item) {
			$id = $item['id'];

			$result[$key] = $item;

			if(isset($this->Db->schema[$resource]['childTables']) && !empty($this->Db->schema[$resource]['childTables'])) {
				$childTables = $this->Db->schema[$resource]['childTables'];
				foreach($childTables as $name => $childTable) {
					$child = $this->Db->fetchChildTable($childTable, $id, 'items');
					$result[$key][$name] = $child;
				}
			}
		}
		if(isset($requestData['id'])) {
			$result = $result[0];
		}

		return $result;
	}

	private function saveSimple($requestData, $postData) {

	}

	private function createSimple($requestData, $postData) {

	}

	private function getChild($requestData) {
		$this->Db->Api->debug['process_log'][] = 'DB: Getting Child Data';
		$id = $requestData['id'];
		$resource = $requestData['resource'];
		$resourceSchema = $this->Db->schema[$resource];

		if(isset($resourceSchema['childTables'][$requestData['child']]) && !empty($resourceSchema['childTables'][$requestData['child']]) ) {
			$childTable = $resourceSchema['childTables'][$requestData['child']];
		} else {
			throw new Exception($requestData['child']." is not a supported child type of ".$resource.".");
		}

		if(!isset($requestData['csv'])) {
			$result = $this->Db->fetchChildTable($childTable, $id, $resource);
		} else {
			$queryData['statement'] = 'SELECT';
			$queryData['from'] = $childTable;

			$parent = substr($resource, 0, -1);

			$queryData['conditions'][] = [
				[
					'type' => 'equals',
					'col' => $childTable.'.'.$parent,
					'value' => $id
				]
			];

			$item = $this->Db->prepareAndExecuteQuery([
				'statement' => 'SELECT',
				'from' => $resource,
				'conditions' => [
					[
						[
							'type' => 'equals',
							'col' => $resource.'.id',
							'value' => $requestData['id']
						]
					]
				],
				'fields' => [
					$resource.'.type'
				],
				'limit' => 1
			]);

			$itemType = $response[0]['type'];
			$child = $this->Api->types[$itemType];

			$validChildValues = array_keys($child[$requestData['child']]);

			$queryData['conditions'] = [];
			foreach($requestData['csv'] as $childValue) {
				if(false !== array_search($childValue, $validChildValues)){
					$queryData['conditions'][] = [
						[
							'type' => 'equals',
							'col' => $selectedChild.'.name',
							'value' => $childValue
						],
						[
							'type' => 'equals',
							'col' => $selectedChild.'.'.$parent,
							'value' => $requestData['id']
						]
					];
					$queryData['fields'] = [
						$selectedChild.'.value',
						$selectedChild.'.value_long'
					];
				} else {
					throw new Exception($childValue.' is not a valid child parameter of '.$itemType);
				}
			}
			$queryData['limit'] = false;

			$childResults = $this->Db->prepareAndExecuteQuery($queryData);
			$result = [];
			foreach($requestData['csv'] as $key => $childValue) {
				$result[$childValue] = isset($childResults[$key]) ? $childResults[$key] : null;
			}
		}

		return $result;
	}

	private function saveChild($requestData, $postData) {
		$this->Db->Api->debug['process_log'][] = 'DB: Saving Child Data';
		$child = $requestData['child'];

		$success = true;
		if($child == 'metadata') {
			$metadata = $postData['metadata'];
			$itemType = $postData['itemType'];
			$validMetadatum = $this->Db->Api->types[$itemType][$child];
			foreach($metadata as $metadataName => $metadataValue) {
				$valid = false;
				foreach($validMetadatum as $validMetadata) {
					if($validMetadata['name'] == $metadataName){
						$valid = true;
					}
				}

				if($valid){
					$queryData = [
						'statement' =>  'UPDATE',
						'from' => 'item_metadata',
						'values' => [$metadataValue],
						'conditions' => [
							[
								[
									'type' => 'equals',
									'col' => 'item_metadata.item',
									'value' => $requestData['id']
								],
								[
									'type' => 'equals',
									'col' => 'item_metadata.name',
									'value' => $metadataName
								]
							]
						]
					];
					if(strlen($metadataValue) > 255){
						$queryData['fields'] = ['value_long'];
					} else {
						$queryData['fields'] = ['value'];
					}
					$response = $this->Db->prepareAndExecuteQuery($queryData);

					if(!$response){
						throw new Exception('Error saving '.$metadataName);
					}
					return $response;
				}
			}
		}
	}

	private function createChild($requestData, $postData) {
		$this->Db->Api->debug['process_log'][] = 'DB: Creating Child Data';
		$child = $requestData['child'];
		$success = true;
		if($child == 'metadata') {
			$metadata = $postData['metadata'];
			$itemType = $postData['itemType'];
			$validMetadatum = $this->Db->Api->types[$itemType][$child];
			foreach($metadata as $metadataName => $metadataValue) {
				$valid = false;
				foreach($validMetadatum as $validMetadata) {
					if($validMetadata['name'] == $metadataName){
						$valid = true;
					}
				}

				if($valid){
					$queryData = [
						'statement' =>  'INSERT INTO',
						'from' => 'item_metadata',
						'fields' => ['item', 'name', 'value'],
						'values' => [$requestData['id'], $metadataName, $metadataValue],
					];
					$response = $this->Db->prepareAndExecuteQuery($queryData);
					$this->Db->Api->debug['temp']['db_response'] = $response;

					if(!$response){
						throw new Exception('Error saving '.$metadataName);
					}
					return $response;
				}
			}
		}
	}

	private function buildResourceJoins($resource) {
		$tableData = $this->schema[$resource];

		if(isset($tableData['childTables']) && !empty($tableData['childTables'])) {
			foreach($tableData['childTables'] as $child) {
				$this->queryData['joins'][] = $child;
			}
		}
	}
}
