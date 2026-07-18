import onnx

modelo = onnx.load("models/yolov8n.onnx")

print("\n=== ENTRADAS ===")
for entrada in modelo.graph.input:
    print(entrada.name)

print("\n=== SAÍDAS ===")
for saida in modelo.graph.output:
    print(saida.name)