<?php

namespace App\Controllers;

class LikeController
{
    private $db;

    public function __construct(\PDO $pdo)
    {
        $this->db = $pdo;
    }

    public function getAll($entryID, $userID)
    {
      $getAll = $this->db->prepare('SELECT likes.userID, likes.entryID, entries.title
      FROM likes
      LEFT JOIN entries ON entries.entryID = likes.entryID
      LEFT JOIN users ON users.userID = likes.userID
      WHERE likes.entryID = :entryID AND likes.userID = :userID');
      $getAll->execute([
        ':entryID' => $entryID,
        ':userID' => $userID
      ]);
      return $getAll->fetch();

    }

    public function getOne($entryID, $userID)
    {
      $getOne = $this->db->prepare('SELECT * FROM likes WHERE entryID = :entryID AND userID = :userID');
      $getOne->execute([
        ':entryID' => $entryID,
        ':userID' => $userID
      ]);
      return $getOne->fetch();
    }

    public function add($entry, $user)
    {

      $addOne = $this->db->prepare(
        'INSERT INTO likes (entryID, userID) VALUES (:entryID, :userID)'
      );

      $addOne->execute([
        ':entryID' => $entry['entryID'],
        ':userID'  => $user
      ]);

      return [
        'entryID' => $entry['entryID'],
        'userID'  => $user
      ];
    }

    public function removeLike($entryID, $userID)
    {
      $statement = $this->db->prepare('DELETE FROM likes WHERE entryID = :entryID AND userID = :userID');
      $statement->execute([
        ':entryID' => $entryID,
        ':userID'  => $userID
      ]);
  }
}
