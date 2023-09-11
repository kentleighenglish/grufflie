<?php
require_once API_PATH."/db/actions.php";

class LoginAction extends Action {

	public function get() {
		$this->Db->Api->debug['process_log'][] = 'DB: Fetching matches usernames';
		$requestData = $this->Db->Api->request['params'];

		if(
			(isset($requestData['csv']['username']) && !empty($requestData['csv']['username'])) &&
			(isset($requestData['csv']['password']) && !empty($requestData['csv']['password']))
		) {
			$response['formData'] = true;
			$username = $requestData['csv']['username'];
			$password = $requestData['csv']['password'];
			$remember = isset($requestData['csv']['remember']) ? $requestData['csv']['remember'] : false;

			$matchedUser = $this->Db->prepareAndExecuteQuery([
				'statement' => 'SELECT',
				'from' => 'users',
				'fields' => ['users.password', 'users.salt', 'users.auth'],
				'conditions' => [[
					[
						'type' => 'equals',
						'col' => 'users.username',
						'value' => $username
					]
				]],
				'limit' => 1
			]);
			if(count($matchedUser)) $this->Db->Api->debug['process_log'][] = 'DB: User found';
			$matchedUser = $matchedUser[0];


			if($matchedUser) {
				$response['user'] = true;
				$salt = $matchedUser['salt'];

				$hashedPasswordSubmitted = $this->Db->generateHash($password, $salt);
				$hashedPassword = $matchedUser['password'];

				if($hashedPasswordSubmitted === $hashedPassword) {
					$response['password'] = true;
					$response['username'] = true;

					$this->Db->createUserSession($remember, $username, $matchedUser['auth']);

					$response['userData'] = [
						'username' => $username,
						'auth' => $matchedUser['auth']
					];
				} else {
					$response['password'] = false;
				}
			} else {
				$response['user'] = false;
			}

		} else {
			$response['formData'] = false;
		}

		return $response;
	}

}
