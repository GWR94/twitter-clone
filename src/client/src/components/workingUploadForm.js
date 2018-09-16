<form action="/api/upload" method="POST">
    <div className="custom-file">
        <label htmtFor="file" id="file" className="custom-file-label">
            <input type="file" name="file" id="file" className="custom-file-input" />
            Choose File
        </label>
        <input type="submit" value="Submit" className="btn btn-primary btn-block" />
    </div>
</form>;
