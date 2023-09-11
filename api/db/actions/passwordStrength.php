<?php
require_once API_PATH."/db/actions.php";
require_once ROOT.DS.'vendor'.DS.'autoload.php';

use ZxcvbnPhp\Zxcvbn;

class PasswordStrengthAction extends Action {

	public function get() {
		$this->Db->Api->debug['process_log'][] = 'DB: Running password strength check';
		$requestData = $this->Db->Api->request['params'];

		if(isset($requestData['csv']['password']) && !empty($requestData['csv']['password'])) {
			$userData = $requestData['csv'];
			$password = $userData['password'];
			unset($userData['password']);

			$zxcvbn = new Zxcvbn();
			$result = $zxcvbn->passwordStrength($password, $userData);

			$this->Db->Api->debug['test'] = $result;

			$result['crack_time_string'] = $this->calculateCrackTime($result['crack_time']);

			return $result;
		}

		return null;
	}

	private function calculateCrackTime($ms) {
		if($ms >= 1000){
			$seconds = $ms / 1000;

			if($seconds >= 60) {
				$minutes = $seconds / 60;

				if($minutes >= 60) {
					$hours = $minutes / 60;

					if($hours >= 24) {
						$days = $hours / 24;

						if($days >= 7) {
							$weeks = $days / 7;

							if($weeks >= 4) {
								$months = $weeks / 4;

								if($months >= 12){
									$years = $months / 12;

									if($years >= 100){
										$centuries = $years / 100;

										if($centuries >= 10){
											$millenia = $centuries / 10;

											if($millenia >= 1000000) {
												$eons = $millenia / 1000000;

												$time = round($eons, 2).' eons';
											} else {
												$time = round($millenia, 2).' millenia';
											}
										} else {
											$time = round($centuries, 2).' centuries';
										}
									} else {
										$time = round($years, 2).' years';
									}
								} else {
									$time = round($months, 2).' months';
								}
							} else {
								$time = round($weeks, 2).' weeks';
							}
						}else{
							$time = round($days, 2).' days';
						}
					}else{
						$time = round($hours, 2).' hours';
					}
				} else {
					$time = round($minutes, 2).' minutes';
				}
			} else {
				$time = round($seconds, 2).' seconds';
			}
		} else {
			$time = round($ms, 4).' milliseconds';
		}

		return $time;
	}

}
