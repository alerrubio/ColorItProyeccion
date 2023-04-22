<?php
	$action = $_POST['action'];

	if ($action == "addUser") 
        add_user();
	else if ($action == "login")
		login();
	else if ($action == "check")
		getUser();
	else if ($action == "getS")
		getScore();
	else if ($action == "addScore")
		addScore();

	function connect() {
		$server="localhost";
        $username="root";
        $password="MikasaGoth3*";
        $db="colorit";

		$mysqli = new mysqli($server, $username, $password, $db);

		if ($mysqli->connect_errno) {
			echo "Problema con la conexion a la base de datos";
			exit();
		}

		return $mysqli;
	}

	function disconnect() {
		mysqli_close();
	}

	function add_user() {
		$user_name = $_POST["user_name"];
        $user_email = $_POST["user_email"];
        $user_pw = $_POST["user_pw"];
		$mysqli = connect();

		$result = $mysqli->prepare('CALL CREATE_USER(?,?,?);');	
		//$result = $mysqli->query("CALL CREATE_SCORE('".$user_email."','".$user_pw."','".$user_name."');");
		if (!$result->execute(array($user_email, $user_pw, $user_name))) {
			$response = array('result' => 'error');
			$error = array('error', $mysqli->error);
			array_push($response, $error);								
		} else {
			$response = array('result' => 'success');
		}
		
		//array_push($result, $response);	
		echo json_encode($response);

		mysqli_close($mysqli);
	}

    function login() {
        $user_email = $_POST["user_email"];
        $user_pw = $_POST["user_pw"];
		$mysqli = connect();
		
		$result = $mysqli->query("CALL LOGIN('".$user_email."');");	
		
		if (!$result) {
			echo "Problema al hacer un query: " . $mysqli->error;								
		} else {
            $rows = array();
			while( $r = $result->fetch_assoc()) {
				$rows[] = $r;
			}

			if (count($rows) == 0)	{
				$rows['result'] = 'not-found';
			}else{
				$rows['result'] = 'found';
			}
			
			echo json_encode($rows);		
		}

		mysqli_close($mysqli);
	}

	function getUser() {
		$user_email = $_POST["user_email"];
		$mysqli = connect();

		$result = $mysqli->query("CALL GET_USER('".$user_email."');");	
		
		if (!$result) {
			echo "Problema al hacer un query: " . $mysqli->error;								
		} else {
			$rows = array();
			while( $r = $result->fetch_assoc() ) {
				$rows[] = $r;
			}			
			if (count($rows) == 0)	{
				$response = array('result' => 'not-found');
			}else{
				$response = array('result' => 'found');
				array_push($response, $rows);
			}

			echo json_encode($response);


		}
		mysqli_close($mysqli);
	}

	function getScore() {
		$user_id = $_POST["user_id"];
		$mysqli = connect();

		$result = $mysqli->query("CALL GET_SCORE_SCREEN(".$user_id.");");	
		
		if (!$result) {
			echo "Problema al hacer un query: " . $mysqli->error;								
		} else {
			$rows = array();
			while( $r = $result->fetch_assoc() ) {
				$rows[] = $r;
			}			
			if (count($rows) == 0)	{
				$response = array('result' => 'not-found');
			}else{
				$response = array('result' => 'found');
				array_push($response, $rows);
			}

			echo json_encode($response);


		}
		mysqli_close($mysqli);
	}

	function addScore() {
		$my_score = $_POST["my_score"];
        $my_id = $_POST["my_id"];
		$game_mode = $_POST["game_mode"];
		$level = $_POST["level"];
		$character = $_POST["character"];
		$mysqli = connect();

		//$result = $mysqli->query("CALL CREATE_SCORE(".$my_score.",".$my_id.",'".$level."','".$game_mode."');");	
		
		$result = $mysqli->prepare('CALL CREATE_SCORE(?,?,?,?,?);');	
		
		if (!$result->execute(array($my_score, $my_id, $level, $game_mode, $character))) {
			//echo "Problema al hacer un query: " . $mysqli->error;
			$response = array('result' => 'error');
			$error = array('error', $mysqli->error);
			array_push($response, $error);								
		} else {
			$response = array('result' => 'success');
		}
		
		//array_push($result, $response);	
		echo json_encode($response);

		mysqli_close($mysqli);
	}
?>