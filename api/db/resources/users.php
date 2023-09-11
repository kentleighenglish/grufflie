<?php
include_once API_PATH."/db/resources.php";

class UsersResource extends Resource {
	private $currentUser;

	private function _authorize() {
		// $currentUser =
		// $requestedUser = $this->Db->prepareAndExecuteQuery([
		// 	'statement' => 'SELECT',
		// 	'from' => 'users',
		// 	'fields' => [
		// 		'username',
		// 		'password',
		// 		'salt',
		// 		'auth'
		// 	],
		// 	'condtions' => [[
		// 		'type' => 'equals',
		// 		'col' => 'users.'
		// 	]],
		// 	'limit' => 1
		// ]);

		$this->Db->Api->debug['process_log'][] = 'DB: Unauthorized Access';
		throw new Exception('Unauthorized Access');
	}

	public function get() {
		$this->Db->Api->debug['process_log'][] = 'DB: Running GET';
		$this->_authorize();

		if(isset($requestData['id'])) {
			$requestData = $this->request['params'];


			$queryData['statement'] = 'SELECT';
			$queryData['from'] = 'users';

			$queryData['conditions'][] = [
				[
					'type' => 'equals',
					'col' => "users.id",
					'value' => $requestData['id']
				]
			];
		}else {
			throw new Exception('Must specify user');
		}

		$users = $this->Db->prepareAndExecuteQuery($queryData);

		return $users;
	}

	//Update User
	public function put() {
		$this->Db->Api->debug['process_log'][] = 'DB: Running PUT';

	}

	//Create User
	public function post() {
		$this->Db->Api->debug['process_log'][] = 'DB: Running POST';
		$requestData = $this->Db->Api->request['params'];

		$formData = $this->Db->Api->request['data'];

		if(
			!empty($formData['username']) &&
			!empty($formData['email']) &&
			!empty($formData['emailConfirm']) &&
			$formData['email'] == $formData['emailConfirm'] &&
			!empty($formData['password']) &&
			!empty($formData['passwordConfirm']) &&
			$formData['password'] == $formData['passwordConfirm']
		) {
			$fields = [
				'username',
				'email',
				'password',
				'salt',
				'auth',
			];

			$salt = $this->Db->generateSalt();
			$hashedPassword = $this->Db->generateHash($formData['password'], $salt);

			$values = [
				$formData['username'],
				$formData['email'],
				$hashedPassword,
				$salt,
				0
			];

			if(isset($formData['firstname'])){
				array_push($fields, 'firstname');
				array_push($values, $formData['firstname']);
			}

			if(isset($formData['lastname'])){
				array_push($fields, 'lastname');
				array_push($values, $formData['lastname']);
			}

			$result = $this->Db->prepareAndExecuteQuery([
				'statement' => 'INSERT INTO',
				'from' => 'users',
				'fields' => $fields,
				'values' => $values
			]);

			return $result;
		} else {
			return false;
		}
	}

	//Delete User
	public function delete() {
		$this->Db->Api->debug['process_log'][] = 'DB: Running DELETE';
	}


}
