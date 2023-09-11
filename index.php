<?php
	if(!preg_match('/^local/', $_SERVER['HTTP_HOST'])){
		if(!defined('TEST_ENVIRONMENT'))
			DEFINE('TEST_ENVIRONMENT', false);
	}else{
		if(!defined('TEST_ENVIRONMENT'))
			DEFINE('TEST_ENVIRONMENT', true);
	}
?>
<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<title>Grufflie</title>
	<base href="/">

	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="icon" type="image/x-icon" href="favicon.ico">

	<link href="https://fonts.googleapis.com/css?family=Mukta+Vaani:200,300,400" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="res/dist/style.css">

	<script src="node_modules/core-js/client/shim.min.js"></script>
	<script src="node_modules/zone.js/dist/zone.js"></script>

	<?php if(!TEST_ENVIRONMENT): ?>
	<script>window.module = 'aot';</script>
	<?php endif; ?>
</head>
<body>
	<app-root>Loading...</app-root>
</body>
<?php if(!TEST_ENVIRONMENT): ?>
<script src="src/build.js"></script>
<?php else: ?>
<script src="node_modules/systemjs/dist/system.src.js"></script>
<script src="systemjs.config.js"></script>
<script>
  System.import('app').catch(function(err){ console.error(err); });
</script>
<?php endif; ?>
</html>
