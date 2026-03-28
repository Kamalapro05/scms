from passlib.context import CryptContext

# Must match exactly what security.py uses
ctx = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")

new_hash = ctx.hash("Admin@123")
print("New hash:", new_hash)