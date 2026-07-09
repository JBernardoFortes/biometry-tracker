# Firmware — Sistema de Auditoria

Documentação de montagem e gravação dos dois firmwares do projeto: **Arduino Mega** (biometria + ultrassônico) e **ESP32-CAM** (câmera + Wi-Fi).

---

## Visão geral da arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                     PC / Servidor                       │
│                                                         │
│   USB ──► Arduino Mega ──► Serial JSON ──► Backend      │
│   USB ──► ESP32-CAM (MB)   Wi-Fi POST  ──► Backend      │
└─────────────────────────────────────────────────────────┘
```

O Mega lida com os sensores físicos e envia eventos via Serial USB. A ESP32-CAM opera de forma independente, capturando fotos em intervalos aleatórios e enviando via Wi-Fi. Os dois não se comunicam entre si.


## Hardware necessário

| Qtd | Componente |
|---|---|
| 1 | Arduino Mega 2560 |
| 1 | ESP32-CAM AI Thinker |
| 1 | Placa MB (shield USB para ESP32-CAM) |
| 1 | Sensor biométrico AS608 |
| 1 | Sensor ultrassônico HC-SR04 |
| — | Protoboard + jumpers |
| — | 2x cabo USB (um para o Mega, um para a MB) |

---

## Parte 1 — Arduino Mega

### Ligação física

**AS608 → Mega**

| AS608 | Arduino Mega | Observação |
|---|---|---|
| VCC (vermelho) | 5V | O módulo exige 5V para operar |
| GND (preto) | GND | — |
| TX (verde) | Pino 17 (RX2) | sensor fala → Mega escuta |
| RX (branco) | Pino 16 (TX2) | Mega fala → sensor escuta |

**HC-SR04 → Mega**

| HC-SR04 | Arduino Mega | Observação |
|---|---|---|
| VCC | 5V | — |
| GND | GND | — |
| Trig | Pino 6 | — |
| Echo | Pino 7 | 5V → 5V, direto sem divisor |

> O GND do AS608 e do HC-SR04 devem estar no mesmo barramento GND do Mega.

### Bibliotecas (Library Manager da IDE Arduino)

- `Adafruit Fingerprint Sensor Library` — por Adafruit (versão 2.0.7 ou superior)
- `NewPing` — por Tim Eckelmanns

### Arquivo de firmware

`mega_integrado.ino`

### Constantes configuráveis

```cpp
const uint8_t  LIMIAR_PRESENCA_CM    = 80;    // distância de detecção do HC-SR04
const uint32_t DEBOUNCE_PRESENCA_MS  = 2000;  // mínimo entre passagens
const uint32_t DEBOUNCE_DIGITAL_MS   = 2000;  // mínimo entre leituras do AS608
const uint32_t JANELA_CONFIRMACAO_MS = 5000;  // tempo máximo entre dedo e passagem

### Lógica de eventos

A biometria não emite evento imediatamente. O fluxo é:

```
1. Usuário bate o dedo no AS608
2. Firmware salva o ID como "pendente" (até 5 segundos)
3. HC-SR04 detecta passagem pela porta
4. Firmware emite entrada ou saida com o ID
5. Se ninguém passar em 5s, o pendente é descartado
6. Passagem sem dedo registrado emite "passagem" sem ID
```

### Comandos disponíveis (Monitor Serial)

| Comando | Ação |
|---|---|
| `e` | Cadastrar nova digital (modo debug) |
| `d` | Apagar todas as digitais |
| `u` | Leitura única do HC-SR04 |

### Formato JSON (saída para o backend)

```json
{"tipo":"entrada","biometriaId":1}
{"tipo":"saida","biometriaId":1}
```

---

## Parte 2 — ESP32-CAM

### Ligação física

A ESP32-CAM fica **acoplada na placa MB o tempo todo**. A MB fornece energia via USB e o chip faz a ponte serial para gravação e Monitor Serial.

```
PC ──USB──► Placa MB ──► ESP32-CAM (espetada nos soquetes da MB)
```

Nenhum sensor externo é conectado à ESP32-CAM.

> O GPIO4 está ligado ao LED flash da placa. Não use GPIO4 para outros fins, pois o LED acende ao inicializar o UART.

### Bibliotecas

Nenhuma biblioteca adicional. O suporte à câmera já vem com o board package `ESP32 by Espressif`.

### Configuração do board package

Se ainda não instalado:

1. `Arquivo → Preferências → URLs adicionais`:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
2. `Ferramentas → Gerenciar Placas → ESP32 by Espressif` → Instalar

### Arquivo de firmware

`auditoria_esp32cam_final.ino`

### Constantes configuráveis

```cpp
const uint32_t AUDIT_MIN_MS = 10UL * 1000UL;  // intervalo mínimo entre capturas
const uint32_t AUDIT_MAX_MS = 30UL * 1000UL;  // intervalo máximo entre capturas

const char* WIFI_SSID     = "sua_rede";
const char* WIFI_PASSWORD = "sua_senha";


const char* SERVER_HOST = "ip_servidor"; 
const int   SERVER_PORT = porta;
const char* SERVER_PATH = "/evento/imagem";
```

### Output esperado no Monitor Serial

```
=== Auditoria ESP32-CAM ===
[Camera] OK
[WiFi] Conectando a sua_rede........
[WiFi] IP: 192.168.1.105
[Auditoria] Proxima em 37 s

[Auditoria] Disparando captura...
[Auditoria] Evento #1 — 38421 bytes
[POST] Resposta: 201
[Auditoria] Proxima em 52 s
```


### Resolução da câmera

O firmware usa `FRAMESIZE_UXGA` (1600×1200) por padrão.