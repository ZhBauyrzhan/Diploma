from pymongo import MongoClient
from pymongo.errors import ConnectionFailure


class SingletonMongoClient:
    __shared_state = {}

    def __init__(self):
        self.__dict__ = self.__shared_state
        if not hasattr(self, "client"):
            self.client = None
            self._initialize_connection()

    def _initialize_connection(self):
        try:
            self.client = MongoClient(
                "mongodb://localhost:27017/",
                maxPoolSize=100,
                connectTimeoutMS=3000,
                serverSelectionTimeoutMS=5000,
            )  # TODO test
            self.client.admin.command("ping")
        except ConnectionFailure as e:
            raise RuntimeError(f"Failed to connect to MongoDB: {str(e)}")

    def get_db(self, db_name="mydb"):
        return self.client[db_name]

    def close_connection(self):
        if self.client:
            self.client.close()
            self.client = None


mongo_client = SingletonMongoClient()


def get_db_handle():
    return mongo_client.get_db()


def get_driver_collection():
    return get_db_handle()["driver_profiles"]


def close_mongo_connections():
    mongo_client.close_connection()
