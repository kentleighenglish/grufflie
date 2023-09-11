<?php
require_once API_PATH."/db/actions.php";

class CheckUsernameAction extends Action {

	public function get() {
		$this->Db->Api->debug['process_log'][] = 'DB: Fetching matches usernames';
		$requestData = $this->Db->Api->request['params'];

		if(isset($requestData['csv']['value']) && !empty($requestData['csv']['value'])) {
			$username = $requestData['csv']['value'];

			$matchedUsers = $this->Db->prepareAndExecuteQuery([
				'statement' => 'SELECT',
				'from' => 'users',
				'fields' => 'users.id',
				'conditions' => [[
					[
						'type' => 'equals',
						'col' => 'users.username',
						'value' => $username
					]
				]]
			]);
			$this->Db->Api->debug['process_log'][] = 'DB: '.count($matchedUsers).' found';

			if(count($matchedUsers)) {
				return 'false';
			} else {
				return 'true';
			}
		}

	}

}
