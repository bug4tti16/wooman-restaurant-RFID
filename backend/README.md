python -m uvicorn main:app --reload --port 8000

pip install -r requirements.txt

<!-- 
python3 -c "import py_compile; py_compile.compile(r'main.py', cfile='output.py')"
python -m uvicorn output:app --reload --port 8080

python3 Main.py -->