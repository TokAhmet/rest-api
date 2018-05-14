<?php

namespace App\Controllers;

class UserController
{
    private $db;
    
    public function __construct($pdo)
    {
        $this->db = $pdo;
    }

    public function getAll()
    {
        $getAllUsers = $this->db->prepare("SELECT * FROM users");
        $getAllUsers->execute();
        $allUsers = $getAllUsers->fetchAll();
        return $allUsers;
    }

    public function getOne($id)
    {
        $getOneUser = $this->db->prepare("SELECT * FROM users WHERE userID = :id");
        $getOneUser->execute([
          ":id" => $id
        ]);
        // Fetch -> single resource
        $oneUser = $getOneUser->fetch();
        return $oneUser;
    }

    public function getLimit(int $amount) 
    {
        $getLimit = $this->db->prepare("SELECT * FROM users LIMIT :amount");
        $getLimit->bindParam(':amount', $amount, \PDO::PARAM_INT);
        $getLimit->execute();
        return $getLimit->fetchAll();
    }

    public function store($username, $password)
    {
        $hash = password_hash($password, PASSWORD_BCRYPT);
        
        $statement = $this->db->prepare(
            'INSERT INTO users (username, password)
            VALUES (:username, :password)'
        );

        $statement->execute([
            ":username" => $username,
            ":password" => $hash
        ]); 
    }

    public function signIn($username, $password)
    {
        $statement = $this->db->prepare("SELECT * from users WHERE username = :username");
        
        $statement->execute([
            ":username" => $username
        ]);

        $user = $statement->fetch();

        if (password_verify($password, $user["password"])) {
            return $user['userID'];
        } else {
            return false;
        }
    }
}
