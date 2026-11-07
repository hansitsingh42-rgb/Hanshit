import subprocess
import tempfile
from pathlib import Path

source = Path(__file__).resolve().parents[1] / "main.c"

with tempfile.TemporaryDirectory() as temp_dir:
    binary = Path(temp_dir) / "student-record-manager"
    subprocess.run(
        ["gcc", "-std=c11", "-Wall", "-Wextra", "-Werror", str(source), "-o", str(binary)],
        check=True,
    )

    cases = [
        (
            "duplicate ID",
            "1\n101\nAsha\nCSE\n90\n1\n101\n2\n5\n",
            "A student with this ID already exists.",
        ),
        (
            "empty name",
            "1\n102\n\n5\n",
            "Name cannot be empty.",
        ),
        (
            "empty course",
            "1\n103\nRavi\n\n5\n",
            "Course cannot be empty.",
        ),
        (
            "NaN marks",
            "1\n104\nMina\nCSE\nnan\n5\n",
            "Marks must be a finite number between 0 and 100.",
        ),
        (
            "out-of-range marks",
            "1\n105\nDev\nCSE\n101\n5\n",
            "Marks must be a finite number between 0 and 100.",
        ),
    ]

    for name, input_data, expected in cases:
        result = subprocess.run(
            [str(binary)],
            input=input_data,
            text=True,
            capture_output=True,
            check=True,
            timeout=5,
        )
        if expected not in result.stdout:
            raise AssertionError(
                f"{name}: expected output not found: {expected!r}\n"
                f"stdout:\n{result.stdout}\nstderr:\n{result.stderr}"
            )
        print(f"PASS: {name}")

print("All C Student Record Manager smoke tests passed.")
