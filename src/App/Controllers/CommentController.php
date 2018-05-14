<?php

namespace App\Controllers;

class CommentController
{
    private $db;

    /**
     * Dependeny Injection (DI): http://www.phptherightway.com/#dependency_injection
     * If this class relies on a database-connection via PDO we inject that connection
     * into the class at start. If we do this commentController will be able to easily
     * reference the PDO with '$this->db' in ALL functions INSIDE the class
     * This class is later being injected into our container inside of 'App/container.php'
     * This results in we being able to call '$this->get('comments')' to call this class
     * inside of our routes.
     */
    public function __construct(\PDO $pdo)
    {
        $this->db = $pdo;
    }

    public function getAll()
    {
        $getAll = $this->db->prepare('SELECT * FROM comments');
        $getAll->execute();
        return $getAll->fetchAll();
    }

    public function getOne($id)
    {
        $getOne = $this->db->prepare('SELECT * FROM comments WHERE commentID = :id');
        $getOne->execute([':id' => $id]);
        return $getOne->fetch();
    }

    public function getLimit(int $amount) 
    {
        $getLimit = $this->db->prepare("SELECT * FROM comments LIMIT :amount");
        $getLimit->bindParam(':amount', $amount, \PDO::PARAM_INT);
        $getLimit->execute();
        return $getLimit->fetchAll();
    }

    public function getEntryComments($entryID) 
    {
        $getEntryComments = $this->db->prepare("SELECT * FROM comments WHERE entryID = :entryID");
        $getEntryComments->execute([':entryID' => $entryID]);
        return $getEntryComments->fetchAll();
    }

    public function getEntryCommentsByLimit(int $entryID, int $amount) 
    {
        $getEntryCommentsByLimit = $this->db->prepare("SELECT * FROM comments WHERE entryID = :entryID LIMIT :amount");
        $getEntryCommentsByLimit->bindParam(':entryID', $entryID, \PDO::PARAM_INT);
        $getEntryCommentsByLimit->bindParam(':amount', $amount, \PDO::PARAM_INT);
        $getEntryCommentsByLimit->execute();
    }

    public function removeComment($commentID)
    {

        $statement = $this->db->prepare("DELETE FROM comments WHERE commentID = :commentID");

        $statement->execute([
            ":commentID" => $commentID
        ]);
    }

    public function add($comment, $userID)
    {
        /**
         * Default 'completed' is false so we only need to insert the 'content'
         */
        $addOne = $this->db->prepare(
            'INSERT INTO comments (entryID, content, createdBy) VALUES (:entryID, :content, :createdBy)'
        );

        /**
         * Insert the value from the parameter into the database
         */
        $addOne->execute([
            ':entryID'     => $comment['entryID'],
            ':content'   => $comment['content'],
            ':createdBy' => $userID
        ]);

        /**
         * A INSERT INTO does not return the created object. If we want to return it to the user
         * that has posted the comment we must build it ourself or fetch it after we have inserted it
         * We can always get the last inserted row in a database by calling 'lastInsertId()'-function
         */
        return [
          'id'          => (int)$this->db->lastInsertId(),
          'content'     => $entry['content'],
          'createdBy'   => $userID
        ];
    }
}
