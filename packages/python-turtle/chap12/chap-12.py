#!/c/work/python37/python.exe
from pathlib import Path
path = Path.cwd() / "textfile.txt"
path.touch()
with path.open(mode="rb") as file:
    for char in file.read():
        print(chr(char), end="");  ## chr
