from passlib.context import CryptContext

ctx = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")

new_hash = ctx.hash("Faculty@123")
print("New hash:", new_hash)