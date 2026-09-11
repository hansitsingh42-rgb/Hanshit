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
