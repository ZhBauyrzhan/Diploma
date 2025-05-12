from back import settings
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
            username = settings.MONGO_INITDB_ROOT_USERNAME
            password = settings.MONGO_INITDB_ROOT_PASSWORD
            authSource = settings.MONGO_INITDB_ROOT_AUTHSOURCE
            # host = settings.MONGO_HOST
            host = "mongodb://mongo:27017/mydb"
            self.client = MongoClient(
                host=host,
                maxPoolSize=100,
                connectTimeoutMS=3000,
                serverSelectionTimeoutMS=5000,
                username=username,
                password=password,
                authSource=authSource,
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
