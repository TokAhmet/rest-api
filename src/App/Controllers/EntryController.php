<?php

namespace App\Controllers;

class EntryController
{
    private $db;

    /**
     * Dependeny Injection (DI): http://www.phptherightway.com/#dependency_injection
     * If this class relies on a database-connection via PDO we inject that connection
     * into the class at start. If we do this TodoController will be able to easily
     * reference the PDO with '$this->db' in ALL functions INSIDE the class
     * This class is later being injected into our container inside of 'App/container.php'
     * This results in we being able to call '$this->get('Todos')' to call this class
     * inside of our routes.
     */
    public function __construct(\PDO $pdo)
    {
        $this->db = $pdo;
    }

    public function getLimit(int $amount) 
    {
        $getLimit = $this->db->prepare("SELECT * FROM `entries` LIMIT :amount");
        $getLimit->bindParam(':amount', $amount, \PDO::PARAM_INT);
        $getLimit->execute();
        return $getLimit->fetchAll();
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

    public function editEntry($entryID, $title, $content)
    {
        $statement = $this->db->prepare("UPDATE entries SET title = :title, content = :content WHERE entryID = :entryID");

        $statement->execute([
            ":entryID" => $entryID,
            ":title" => $title,
            ":content" => $content
        ]);
    }

    public function removeEntry($entryID)
    {

        $statement = $this->db->prepare("DELETE FROM entries WHERE entryID = :entryID");

        $statement->execute([
            ":entryID" => $entryID
        ]);
    }

    public function add($entry, $userID)
    {
        /**
         * Default 'completed' is false so we only need to insert the 'content'
         */
        $addOne = $this->db->prepare(
            'INSERT INTO entries (title, content, createdBy) VALUES (:title, :content, :createdBy)'
        );

        /**
         * Insert the value from the parameter into the database
         */
        $addOne->execute([
            ':title'     => $entry['title'],
            ':content'   => $entry['content'],
            ':createdBy' => $userID
        ]);

        /**
         * A INSERT INTO does not return the created object. If we want to return it to the user
         * that has posted the todo we must build it ourself or fetch it after we have inserted it
         * We can always get the last inserted row in a database by calling 'lastInsertId()'-function
         */
        return [
          'id'          => (int)$this->db->lastInsertId(),
          'content'     => $entry['content'],
          'completed'   => false
        ];
    }
}
