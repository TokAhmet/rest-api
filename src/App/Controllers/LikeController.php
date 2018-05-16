<?php

namespace App\Controllers;

class LikeController
{
    private $db;

    /**
     * Dependeny Injection (DI): http://www.phptherightway.com/#dependency_injection
     * If this class relies on a database-connection via PDO we inject that connection
     * into the class at start. If we do this EntryController will be able to easily
     * reference the PDO with '$this->db' in ALL functions INSIDE the class
     * This class is later being injected into our container inside of 'App/container.php'
     * This results in we being able to call '$this->get('entries')' to call this class
     * inside of our routes.
     */
    public function __construct(\PDO $pdo)
    {
        $this->db = $pdo;
    }

    public function getAll()
    {
        $getAll = $this->db->prepare('SELECT * FROM likes');
        $getAll->execute();
        return $getAll->fetchAll();
    }

    public function removeLike($entryID, $userID)
    {

        $statement = $this->db->prepare("DELETE FROM likes WHERE entryID = :entryID AND userID = :userID");

        $statement->execute([
            ":entryID" => $entryID,
            ":userID" => $userID
        ]);
    }

    public function add($entryID, $userID)
    {
        /**
         * Default 'completed' is false so we only need to insert the 'content'
         */
        $addOne = $this->db->prepare(
            'INSERT INTO likes (entryID, userID) VALUES (:entryID, :userID)'
        );

        /**
         * Insert the value from the parameter into the database
         */
        $addOne->execute([
            ':entryID'  => $entryID,
            ':userID'   => $userID
        ]);

        /**
         * A INSERT INTO does not return the created object. If we want to return it to the user
         * that has posted the entry we must build it ourself or fetch it after we have inserted it
         * We can always get the last inserted row in a database by calling 'lastInsertId()'-function
         */
        return [
          'id'          => (int)$this->db->lastInsertId(),
          'completed'   => false
        ];
    }
}
