from core import (
    config, db
)

class Repo():
    def __init__(self, table):
        self.table = table
    def create_one(self, model):
        return db.create_one(self.table, model)
    def update_one(self, model):
        return db.update_one(self.table, model)
    def delete_one(self, id):
        return db.delete_one(self.table, id)
    def find_one(self, where=None):
        return db.find_one(self.table, where=where)
    def find_many(self, where=None, limit=None):
        return db.find_many(self.table, where=where, limit=limit)

for module in config.modules:
    globals()[module] = Repo(module)