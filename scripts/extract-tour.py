"""Recover the complete 3DVista web tour from the standalone Windows EXE.

The EXE is a 3DVista "tourlauncher": a small stub followed by a JSON header
and a zstd-compressed tar stream holding the Electron runtime plus
resources/app/ (the actual web tour). We stream-decompress the tar and keep
only resources/app/*, written to public/virtual-tour/.

Usage: python scripts/extract-tour.py [path-to-exe]
"""
import os
import sys
import tarfile
import mmap
import zstandard

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXE = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "..", "Adinarayan_3D_File.exe")
OUT = os.path.join(ROOT, "public", "virtual-tour")
PREFIX = "resources/app/"
ZSTD_MAGIC = b"\x28\xb5\x2f\xfd"


def find_stream_offset(path):
    with open(path, "rb") as f, mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ) as m:
        header = m.find(b'"uncompressed_size"')
        if header < 0:
            raise SystemExit("tourlauncher header not found")
        off = m.find(ZSTD_MAGIC, header)
        if off < 0:
            raise SystemExit("zstd stream not found after header")
        return off


def main():
    offset = find_stream_offset(EXE)
    print(f"zstd stream at offset {offset}")
    os.makedirs(OUT, exist_ok=True)
    count = size = 0
    last = None
    with open(EXE, "rb") as f:
        f.seek(offset)
        reader = zstandard.ZstdDecompressor().stream_reader(f, read_across_frames=True)
        tar = tarfile.open(fileobj=reader, mode="r|")
        try:
            for member in tar:
                last = member.name
                if not member.name.startswith(PREFIX) or not member.isfile():
                    continue
                rel = member.name[len(PREFIX):]
                dest = os.path.join(OUT, *rel.split("/"))
                os.makedirs(os.path.dirname(dest), exist_ok=True)
                src = tar.extractfile(member)
                with open(dest, "wb") as out:
                    while chunk := src.read(1 << 20):
                        out.write(chunk)
                count += 1
                size += member.size
        except zstandard.ZstdError as e:
            # The launcher appends non-zstd data after the archive; the tar
            # end-of-archive marker lives inside the stream, so this is benign
            # as long as the last member is the final entry.
            print(f"stream ended: {e} (last member: {last})")
    print(f"extracted {count} files, {size / 1e6:.1f} MB -> {OUT}")
    if not os.path.exists(os.path.join(OUT, "script.js")):
        print("WARNING: script.js missing")
    rebrand()


def rebrand():
    """The tour was authored as "Milan Park Dombivli" (the plot's society name).
    Rename the visible title; the skin images already carry the Adinarayan logo."""
    for rel, old, new in [
        ("index.htm", "<title>Milan Park Dombivli</title>", "<title>RADIANCE — Virtual Tour | Adinarayan Buildcon LLP</title>"),
        ("index.htm", '<meta name="theme-color" content="#FFFFFF"/>', '<meta name="theme-color" content="#0E1628"/>'),
        ("locale/en.txt", "tour.name = Milan Park Dombivli", "tour.name = RADIANCE"),
    ]:
        path = os.path.join(OUT, rel)
        with open(path, encoding="utf-8") as f:
            text = f.read()
        if old in text:
            with open(path, "w", encoding="utf-8", newline="") as f:
                f.write(text.replace(old, new))
            print(f"rebranded {rel}")


if __name__ == "__main__":
    main()
