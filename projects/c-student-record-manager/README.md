# C Student Record Management System

A beginner-friendly console application written in C for managing student records.

## Features

- Add student records
- List all students
- Search by student ID
- Delete a student record
- Input validation for IDs, menu choices and marks
- Fixed maximum capacity of 100 records

## Data stored

Each record contains:

- Student ID
- Student name
- Course
- Marks

## Concepts practiced

C structures, arrays, functions, loops, conditional statements, string handling, input validation and menu-driven programming.

## Run

Compile with a C compiler:

```bash
gcc main.c -o student-record-manager
./student-record-manager
```

On Windows with MinGW:

```bash
gcc main.c -o student-record-manager.exe
student-record-manager.exe
```

## Current limitation

Records are stored in memory while the program is running. File-based permanent storage can be added as a future improvement.

## Engineering Evidence

**Architecture:** Menu-driven C program → validated input → in-memory record array → CRUD operations.

**Validation:** Input handling validates IDs, menu choices and marks. Repository CI also validates JavaScript/HTML files used by the wider portfolio.

**Security / robustness:** The program avoids credentials and uses bounded in-memory capacity. Input validation is part of the implementation; persistent file storage is intentionally not claimed.

**Live demo:** The repository also contains a browser demo under `live-demo/`.

## Verification Checklist

- Add record
- List records
- Search by ID
- Delete record
- Invalid input handling
- GCC/MinGW compilation path


> **Live Preview:** [Open C Student Record Manager](https://hansitsingh42-rgb.github.io/Hanshit/c-student-record-manager/) · [Open in Live Preview Viewer](https://hansitsingh42-rgb.github.io/Hanshit/demo/?project=c-student-record-manager)
