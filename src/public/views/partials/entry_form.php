<div class="container">
  <h1 class="text-center">Entries</h1>
  <form class="form-horizontal" method="POST" id="entryForm">
    <div class="form-group">
      <label class="control-label col-sm-4" for="title">Titel:</label>
      <div class="col-sm-5">
        <input type="text" class="form-control" name="title" id="title" placeholder="Titel">
      </div>
    </div>
    <div class="form-group">
      <label class="control-label col-sm-4" for="content">Content:</label>
      <div class="col-sm-5">
        <textarea class="form-control" name="content" id="content" placeholder="Write Content"></textarea>
      </div>
    </div>
    <div class="form-group">
      <div class="col-sm-12">
        <Button type="submit" class="center-block btn btn-success" id="addEntry">Post Entry</Button>
      </div>
    </div>
  </form>
</div>
