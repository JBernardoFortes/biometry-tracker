import serial
import requests
import json
import time

PORTA_SERIAL = '/dev/ttyACM0' 
BAUD_RATE = 9600
URL_API = 'http://127.0.0.1:8000/evento' 

def iniciar_ponte():
    try:
        # Inicializa a conexão com o Arduino
        arduino = serial.Serial(PORTA_SERIAL, BAUD_RATE, timeout=1)
        print(f"Conectado ao Arduino na porta {PORTA_SERIAL}.")
        print(f"Escutando eventos e enviando para {URL_API}...\n")
        
        time.sleep(2) 

        while True:
            if arduino.in_waiting > 0:
                linha = arduino.readline().decode('utf-8', errors='ignore').strip()
                
                if linha.startswith('{') and linha.endswith('}'):                    
                    try:
                        payload = json.loads(linha)
                        
                        resposta = requests.post(URL_API, json=payload, timeout=3)
                        
                        if resposta.status_code == 200:
                            print(f"[API] Sucesso: {resposta.json()}")
                        else:
                            print(f"[API] Erro {resposta.status_code}: {resposta.text}")
                            
                    except json.JSONDecodeError:
                        print("[ERRO] JSON malformado recebido da Serial.")
                    except requests.exceptions.RequestException as e:
                        print(f"[ERRO] Falha ao conectar com o FastAPI. Ele está rodando? Detalhe: {e}")
                
                elif linha:
                    print(f"[DEBUG ARDUINO] {linha}")

    except serial.SerialException as e:
        print(f"Erro ao abrir a porta serial: {e}")
    except KeyboardInterrupt:
        print("\n[*] Encerrando ponte serial.")
    finally:
        if 'arduino' in locals() and arduino.is_open:
            arduino.close()

if __name__ == "__main__":
    iniciar_ponte()