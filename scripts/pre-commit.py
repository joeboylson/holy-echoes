import re
import argparse

OKGREEN = "\033[92m"
ENDC = "\033[0m"


def increment_version(current_version, bump):
    major, minor, patch = map(int, current_version.split("."))
    if bump == "major":
        return f"{major + 1}.0.0"
    elif bump == "minor":
        return f"{major}.{minor + 1}.0"
    else:
        return f"{major}.{minor}.{patch + 1}"


def get_current_version():
    with open("VERSION.txt", "r") as file:
        lines = file.readlines()

        # read the last line
        return lines[-1].strip()


def write_version(filepath, new_version):

    version_pattern = r"\b\d+\.\d+\.\d+\b"

    # Read the file content
    with open(filepath, "r") as file:
        content = file.read()

    # Replace all version number matches with the new version
    count = 1 if "package.json" in filepath else 0
    updated_content = re.sub(version_pattern, new_version, content, count=count)

    # Write the updated content back to the file
    with open(filepath, "w") as file:
        file.write(updated_content)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Increment the project version.")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--major", action="store_true", help="Bump major version (x.0.0)")
    group.add_argument("--minor", action="store_true", help="Bump minor version (x.y.0)")
    group.add_argument("--patch", action="store_true", help="Bump patch version (x.y.z) — default")
    args = parser.parse_args()

    bump = "major" if args.major else "minor" if args.minor else "patch"

    current_version = get_current_version()
    incremented_version = increment_version(current_version, bump)

    message = f"[INCREMENTING VERSION]: {current_version} -> {incremented_version}"
    print(f"\n{OKGREEN}{message}{ENDC}\n")

    filepaths_with_version = ["VERSION.txt", "package.json"]

    for filepath in filepaths_with_version:
        write_version(filepath, incremented_version)
