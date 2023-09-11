<?php

class DiscogsCrawler {

	private $url = 'https://api.discogs.com/';
	private $key = 'QZWEnrjhbBJPTbtYrrMo';
	private $secret = 'WHkjrmFvdnliYrEIBcEZwfHRfIsRJqfw';

	private $newArtists;
	private $artistCount = 1;

	private $Crawler;

	public function __construct($crawler) {
		$this->Crawler = $crawler;
	}

	public function crawl() {
		$total = 2;
		$url = $this->url.'database/search?key='.$this->key.'&secret='.$this->secret.'&type=artist&per_page=100';
		for($i = 1; $i <= $total; $i++){
			$response = $this->apiExec($url);
			if($response){
				$responseContent = $response['body'];

				if(isset($responseContent->pagination) && isset($responseContent->results)){
					$total = $responseContent->pagination->pages;
					$url = $responseContent->pagination->urls->next;
					$results = $responseContent->results;

					foreach($results as $artist) {
						$this->parseArtist($artist);
					}
					if(!isset($this->Crawler->args['readonly']) && !empty($this->Crawler->saveArtistList)){
						$this->Crawler->saveAllArtists();
					}
				} else {
					$this->Crawler->output(var_dump($responseContent));
				}

			} else {
				break;
			}
		}


	}

	public function apiExec($url, $image = false) {
		$ch = curl_init();

		if($image) {
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_HEADER, 0);
			curl_setopt($ch, CURLOPT_USERAGENT, 'Grufflie/1.0');
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
		} else {
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_HEADER, 1);
			curl_setopt($ch, CURLOPT_USERAGENT, 'Grufflie/1.0');
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		}

		$this->Crawler->output("Running curl on: ".$url);
		$response = curl_exec($ch);
		$error = curl_error($ch);
		$result = array(
			'header' => '', 
			'body' => '', 
			'curl_error' => '', 
			'http_code' => '',
			'last_url' => ''
		);

		if ( $error != "" ) {
			$result['curl_error'] = $error;
			return $result;
		}

		$header_size = curl_getinfo($ch,CURLINFO_HEADER_SIZE);
		$result['header'] = substr($response, 0, $header_size);
		$result['body'] = json_decode(substr( $response, $header_size ));
		$result['http_code'] = curl_getinfo($ch,CURLINFO_HTTP_CODE);
		$result['last_url'] = curl_getinfo($ch,CURLINFO_EFFECTIVE_URL);
		curl_close($ch);

		if(!$image) {
			return $result;
		} else {
			return $response;
		}
	}

	public function parseArtist($artist) {
		if($artist) {
			$this->Crawler->output("Artist Retrieved (".$this->artistCount."): ".$artist->title);

			$artistParsed = [
				"gen_id" => $artist->id,
				"name" => $artist->title,
				"thumb" => $artist->thumb
			];

			if(!isset($this->Crawler->args['readonly'])){
				if($this->Crawler->validates($artistParsed)){
					$this->Crawler->saveArtist($artistParsed);
				} else {
					$this->Crawler->output("Artist Exists: ".$artist->title);
				}
			}
			$this->artistCount++;
		}
	}


}