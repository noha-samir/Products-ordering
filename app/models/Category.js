
class Category {

    category_id = null;
    category_name = null;
    parent_id = null;

    listCategories(gConnection, limit, offset, finallCallback) {
        let pagenation = '';
        if (limit != undefined && offset != undefined) {
            pagenation = `LIMIT ${limit} OFFSET ${offset}`;
        }
        var preparedSqlQuery = `SELECT * FROM category 
        WHERE COALESCE(parent_id,'') = COALESCE(${this.parent_id.category_id},parent_id,'') ${pagenation}; `;

        gConnection.query(preparedSqlQuery, function (err, results, fields) {
            if (!err && results) {
                let arrOfCategories = [];
                results.forEach(element => {
                    let self = new Category();
                    self.category_id = element.category_id;
                    self.category_name = element.category_name;
                    self.parent_id = {
                        "category_id": element.parent_id
                    }
                    arrOfCategories.push(self);
                });
                finallCallback(null, arrOfCategories);
            }
            else {
                finallCallback(err);
            }
        });
    }
}

module.exports = Category;