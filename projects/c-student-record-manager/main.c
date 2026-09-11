#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_STUDENTS 100
#define NAME_LEN 60
#define COURSE_LEN 40

typedef struct {
    int id;
    char name[NAME_LEN];
    char course[COURSE_LEN];
    float marks;
} Student;

Student students[MAX_STUDENTS];
int studentCount = 0;

void clearInput(void) {
    int c;
    while ((c = getchar()) != '\n' && c != EOF) {}
}

void addStudent(void) {
    if (studentCount >= MAX_STUDENTS) {
        printf("\nStudent limit reached.\n");
        return;
    }

    Student s;
    printf("\nEnter student ID: ");
    if (scanf("%d", &s.id) != 1) { clearInput(); printf("Invalid ID.\n"); return; }
    clearInput();

    printf("Enter name: ");
    if (!fgets(s.name, sizeof(s.name), stdin)) return;
    s.name[strcspn(s.name, "\n")] = '\0';

    printf("Enter course: ");
    if (!fgets(s.course, sizeof(s.course), stdin)) return;
    s.course[strcspn(s.course, "\n")] = '\0';

    printf("Enter marks (0-100): ");
    if (scanf("%f", &s.marks) != 1) { clearInput(); printf("Invalid marks.\n"); return; }
    clearInput();
    if (s.marks < 0 || s.marks > 100) { printf("Marks must be between 0 and 100.\n"); return; }

    students[studentCount++] = s;
    printf("Student added successfully.\n");
}

void listStudents(void) {
    if (studentCount == 0) { printf("\nNo student records found.\n"); return; }
    printf("\n%-6s %-24s %-20s %-8s\n", "ID", "Name", "Course", "Marks");
    printf("---------------------------------------------------------------\n");
    for (int i = 0; i < studentCount; i++)
        printf("%-6d %-24s %-20s %-8.2f\n", students[i].id, students[i].name, students[i].course, students[i].marks);
}

void searchStudent(void) {
    int id;
    printf("\nEnter student ID: ");
    if (scanf("%d", &id) != 1) { clearInput(); printf("Invalid ID.\n"); return; }
    clearInput();
    for (int i = 0; i < studentCount; i++) {
        if (students[i].id == id) {
            printf("\nID: %d\nName: %s\nCourse: %s\nMarks: %.2f\n", students[i].id, students[i].name, students[i].course, students[i].marks);
            return;
        }
    }
    printf("Student not found.\n");
}

void deleteStudent(void) {
    int id;
    printf("\nEnter student ID to delete: ");
    if (scanf("%d", &id) != 1) { clearInput(); printf("Invalid ID.\n"); return; }
    clearInput();
    for (int i = 0; i < studentCount; i++) {
        if (students[i].id == id) {
            for (int j = i; j < studentCount - 1; j++) students[j] = students[j + 1];
            studentCount--;
            printf("Student deleted successfully.\n");
            return;
        }
    }
    printf("Student not found.\n");
}

int main(void) {
    int choice;
    printf("========================================\n");
    printf("     C STUDENT RECORD MANAGEMENT\n");
    printf("========================================\n");

    do {
        printf("\n1. Add Student\n2. List Students\n3. Search Student\n4. Delete Student\n5. Exit\n");
        printf("Choose an option: ");
        if (scanf("%d", &choice) != 1) { clearInput(); printf("Please enter a number.\n"); continue; }
        clearInput();
        switch (choice) {
            case 1: addStudent(); break;
            case 2: listStudents(); break;
            case 3: searchStudent(); break;
            case 4: deleteStudent(); break;
            case 5: printf("Goodbye.\n"); break;
            default: printf("Invalid option. Choose 1-5.\n");
        }
    } while (choice != 5);

    return 0;
}
