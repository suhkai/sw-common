# Book 

## 4

chr() converst integer to char code

Python Basics: A Practical Introduction to Python 3

## 12.4 Common file system operations

`import pathlib`
`from pathlib import Path`

pathobj = Path.home() # returns PosixPath or WindowsPath of OS-user home dir

path.mkdir() // makes directory
path.exists() // boolean return, path exists or not
path.is_dir() // actual does an "lstat" kind of thing
path.mkdir(exist_ok=True) // if the path exist will not throw error
path.mkdir(exist_ok=True, parents=True) // parts of the path can exist
path.touch() // normal functionality of unix touch (ofc directory of the file must exist)
path.is_file() // lstat is used for this
path.parent // property (not a function, gives parent)
path.iterdir() // returns itarator to iterate over all dir entries
path.glob('*.txt') // like old posix tool "glob"
`path.glob('*.js') // shorthand for path.glob('**/*js') recursive glob`

// needed to test if this was normal functionality in unix
// seems to be the behavior of linux 'mv' command
// linux: if "destination" is a dir and "source" is a dir, then existing files get replaced, 
// linux: if "destination" is a nonempty dir and "source" is an empty dir "mv src dst" puts src dir as subdir in dst/
path_source.replace(path_destination) // works weird, its a move, but can also delete (target files) if it already exist

path.unlink() // delete file
path.unlink(missing_ok=True) //dont throw if not exist
path.rmdir() // remove directory

import shutil // shell utils

shutil.rmtree(pathobject) // like rm -rf

## 12.5 Reading and writing files

2 ways of creating a fileObject in python

- Path.open()
- open() (buildin)


### Arguments

#### modes (first argument to open(..))

- r:read  (text)
- w:write (text), truncates file if exist
- a:append (text)
- rb:read binary
- wb:write binary truncates file if exist
- ab:append binary

#### encodings (second argument to open(..))

- ascii
- utf-8
- utf-16
- utf-32 //ok whats this?


## Path.open(..)

```python
fileObject = path.open(mode="r", encoding="utf-8")
```

## open(..) (buildin)

```python
 fileObject = open(file_path, mode="r", encoding="utf-8"); ## buildin
```

## close

```python
fileObject.close() //close file
```

## with

```python
with open(file_path, mode="..", encoding="..") as file:
    # do something with file
```

file.readlines()
file.read()

## writing data

File must have been opened with mode="w" or "wb"

file.write("\n...") // if the file is open in textmode, make sure to start writing on a new line (\n may be necessary)
file.writelines(["...\n","...\n"]) // array of lines to write, writelines doesnt gues the linefeed of the OS, so bring your own LF

## 12.6 Read and write CSV files


### writing

```python
import csv
# create fileobject with one of the open() functions
daily_temperaturs = [
    [68,65,68,70,74,72],
    [67,67,70,72,72,70],
    [68,70,74,76,74,73]
]
writer = csv.writer(file)
for temp_list in daily_temperaturs:
    writer.writerow(temp_list)
```

writer = csv.writer(file)

### reading

reader = csv.reader(file) // iterable

```python
daily_tempraturees = [];
with file_path.open(mode="r", encoding="utf-8") as file:
    reader = csv.reader(file)
    for row in reader:
        # Convert row to list of integers
        int_row = [int(value) for value in row]  # generator maps string to ints
        # Append the list of integers to daily_temperatures list
        daily_temperatures.append(int_row)
```

### reading csv with header

```python
reader = csv.DictReader(file);   # first line is a header

reader.fieldnames # [ "names", "department", "salary" ]

for row in reader:
    print(row) # it is a dictionary { [column_name]: column_value }
    #
    # { 'name': 'Lee',...,'salary': '8000.00' }
    # correct salary string with  row['salary'] = float(row['salary'])
    #
file.close();
```

### writing csv with header



```python
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
    },
]
file_path = Path.home() / "people.csv"
file = file_path.open(mode="w", encoding="utf-8")
writer = csv.DictWriter(file, fieldnames=["name", "age"])
## or writer = csv.DictWriter(file, fieldnames=peope[0].keys())
writer.writerows(people);
file.close();
```

- writer.writerows(...);
- writer.writeheader();


## 13 Pip

- pip install
- pip unsintall
- pip list // (show installed packages)
- pip install --upgrade pip  // (upgrade pip itself)
- pip --version //(show version)
- pip install package>version   // install version bigger then "version"
- pip install package>=version  // install version at least "version"
- pip install package==version // install exactly this version
- idem for < <=
- pip show package-name

```bash
python3 -m venv env       # create virtual environment
source env/bin/activate   # activate the virtual environment
deactivate                # deactivate is in your path

```

## 14 pdf

































