import sys
from pathlib import Path

# Permite importar main.py al ejecutar pytest desde ia-microservice/
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
