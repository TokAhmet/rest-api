<?php

namespace App\Controllers;

class EntryController
{
    private $db;

    public function __construct(\PDO $pdo)
    {
        $this->db = $pdo;
    }

    public function getAll()
    {
        $getAll = $this->db->prepare('SELECT * FROM entries');
        $getAll->execute();
        return $getAll->fetchAll();
    }

    public function getOne($id)
    {
        $getOne = $this->db->prepare('SELECT * FROM entries WHERE entryID = :id');
        $getOne->execute([':id' => $id]);
        return $getOne->fetch();
    }

    public function add($entry)
    {
        /**
         * Default 'completed' is false so we only need to insert the 'content'
         */
        $addOne = $this->db->prepare(
            'INSERT INTO entries (title,content) VALUES (:title,:content)'
        );

        /**
         * Insert the value from the parameter into the database
         */
        $addOne->execute([
          ":title" => $entry["title"],
          ':content'  => $entry['content'],
      ]);

        /**
         * A INSERT INTO does not return the created object. If we want to return it to the user
         * that has posted the todo we must build it ourself or fetch it after we have inserted it
         * We can always get the last inserted row in a database by calling 'lastInsertId()'-function
         */
        return [
          'id'          => (int)$this->db->lastInsertId(),
          "title"       => $entry["title"],
          'content'     => $entry['content'],
        ];
    }
  }
