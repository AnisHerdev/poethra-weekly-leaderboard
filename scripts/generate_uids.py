"""
generate_uids.py - Quick utility to generate unique IDs for new people
in data/people.ts.

Usage:
    python scripts/generate_uids.py
    > Press ENTER for 1 UID, or type a number and press ENTER:
    > 3
    5a2f1b4c
    9d8e7f6a
    3c4b5a2d

Copy the generated UIDs and paste them into the uid field of a new Person
in data/people.ts.
"""

import uuid


def short_uid() -> str:
    """Returns the first 8 hex characters of a UUID4 (32-bit, collision-resistant)."""
    return uuid.uuid4().hex[:8]


def main():
    print("=" * 40)
    print("  Poéthra UID Generator")
    print("=" * 40)
    raw = input("Press ENTER for 1 UID, or type a number and press ENTER: ").strip()

    try:
        count = int(raw) if raw else 1
        if count < 1:
            raise ValueError
    except ValueError:
        print("Invalid input. Generating 1 UID.")
        count = 1

    print()
    for _ in range(count):
        print(short_uid())
    print()


if __name__ == "__main__":
    main()
