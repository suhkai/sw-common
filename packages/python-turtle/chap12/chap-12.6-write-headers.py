#!/c/work/python37/python.exe
from pathlib import Path
import csv
people = [
    {
        "name": "Veronica",
        "age": 29
    },
    {   "name": "Audrey",
        "age": 32
    },
    {   
        "name": "Sam",
        "age": 24
    }
]
file_path = Path.cwd() / "people.csv"
file = file_path.open(mode="w", encoding="utf-8", newline='')
writer = csv.DictWriter(file, fieldnames=["name", "age"])
## or writer = csv.DictWriter(file, fieldnames=peope[0].keys())
writer.writeheader()
writer.writerows(people);
file.close();