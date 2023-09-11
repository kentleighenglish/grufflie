<?php
require_once API_PATH."/db/actions.php";

class LoggedInAction extends Action {

	public function get() {
		return $this->Db->isLoggedIn(true);
	}

}
