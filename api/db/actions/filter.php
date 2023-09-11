<?php
require_once API_PATH."/db/actions.php";

class FilterAction extends Action {

	public function get() {
		$requestData = $this->request['params'];

		$queryData['statement'] = 'SELECT';

		$queryData['from'] = 'items';
		$params = $requestData['csv'];

		$filterConditions = [];
		if(isset($params['query']) && !empty($params['query'])) {
			$filterConditions[] = [
				'type' => 'like',
				'col' => 'items.name',
				'value' => $params['query']
			];
		}

		if(isset($params['type']) && !empty($params['type'])) {
			$filterConditions[] = [
				'type' => 'equals',
				'col' => 'items.type',
				'value' => $params['type']
			];
		}

		if(isset($params['tag']) && !empty($params['tag'])) {
			$queryData['joins'][] = [
				'type' => 'right',
				'table' => 'tags',
				'on' => ['items.id', 'tags.item']
			];
			$filterConditions[] = [
				'type' => 'equals',
				'col' => 'tags.name',
				'value' => $params['tag']
			];
		}

		if(isset($params['limit']) && !empty($params['limit'])) {
			$queryData['limit'] = $params['limit'];
		}

		if(isset($params['offset']) && !empty($params['offset'])) {
			$queryData['offset'] = $params['offset'];
		}

		$queryData['conditions'][] = $filterConditions;

		$queryData['fields'] = [
			'items.id',
			'items.name',
			'items.type',
			'items.parent'
		];


		$itemResults = $this->Db->prepareAndExecuteQuery($queryData);

		if($itemResults) {
			foreach($itemResults as $key => $item){
				$id = $item['id'];

				$result[$key] = $item;

				if(isset($this->Db->schema['items']['childTables']) && !empty($this->Db->schema['items']['childTables'])) {
					$childTables = $this->Db->schema['items']['childTables'];
					foreach($childTables as $name => $childTable) {
						$child = $this->Db->fetchChildTable($childTable, $id, 'items');

						if($childTable == 'relations'){
							$itemTags = $result[$key]['tags'];
							if(!empty($itemTags)){
								foreach($child as &$relation) {
									$similarTags = 0;
									if(!empty($relation['tags'])){
										foreach($relation['tags'] as $tag){
											if(false !== array_search($tag['name'], array_column($itemTags, 'name')) ){
												$similarTags++;
											}
										}
									}
									$relation['similar_tags'] = $similarTags;
								}
							}

							$result[$key]['relations'] = $child;

						} else {
							$result[$key][$name] = $child;
						}
					}
				}
			}
		}

		if(isset($result)) {
			return $result;
		}else {
			return null;
		}
	}

	public function put() {

	}

	public function post() {

	}
}
