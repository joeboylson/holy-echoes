import re

OKGREEN = "\033[92m"
ENDC = "\033[0m"


def increment_version(current_version):
    segments = current_version.split(".")
    segments[-1] = str(int(segments[-1]) + 1)
    return ".".join(segments)


def get_current_version():
    with open("VERSION.txt", "r") as file:
        lines = file.readlines()

        # read the last line
        return lines[-1]


def write_version(filepath, new_version):

    version_pattern = r"\b\d+\.\d+\.\d+\b"

    # Read the file content
    with open(filepath, "r") as file:
        content = file.read()

    # Replace all version number matches with the new version
    updated_content = re.sub(version_pattern, new_version, content)

    # Write the updated content back to the file
    with open(filepath, "w") as file:
        file.write(updated_content)


if __name__ == "__main__":
    current_version = get_current_version()
    incremented_version = increment_version(current_version)

    message = f"[INCREMENTING VERSION]: {current_version} -> {incremented_version}"
    print(f"\n{OKGREEN}{message}{ENDC}\n")

    filepaths_with_version = ["VERSION.txt", "package.json"]

    for filepath in filepaths_with_version:
        write_version(filepath, incremented_version)
