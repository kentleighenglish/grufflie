<?php
require_once API_PATH."/db/actions.php";

class LogoutAction extends Action {

	public function get() {
		$this->Db->Api->debug['process_log'][] = 'DB: Logging out';

		$result = $this->Db->destroyUserSession();

		if($result)
			return true;

		return false;
	}

}
