import sys
import os

# từ app/tests -> ../../ => d:\...\SWE-251\backend
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)