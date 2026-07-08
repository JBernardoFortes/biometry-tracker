/*
 * =====================================================================
 * Arduino Mega: AS608 + HC-SR04 
 * =====================================================================
 *
 * Bibliotecas necessárias (Library Manager):
 * "Adafruit Fingerprint Sensor Library" (Adafruit)
 * "NewPing" (Tim Eckelmanns)
 * *
 * COMANDOS (Monitor Serial):
 * e → cadastrar digital (debug)
 * d → apagar todas as digitais (debug)
 * u → leitura única do ultrassônico
 * =====================================================================
 */
#include <Adafruit_Fingerprint.h>
#include <NewPing.h>

const uint8_t  LIMIAR_PRESENCA_CM    = 80;    // distância de detecção (cm)
const uint32_t DEBOUNCE_PRESENCA_MS  = 1000;  // intervalo mínimo entre passagens
const uint16_t MAX_DISTANCIA_CM      = 200;
const uint16_t INTERVALO_ULTRASSOM_MS = 100;  // polling mais rápido para porta
const uint32_t FP_BAUD               = 57600;
const uint32_t DEBOUNCE_DIGITAL_MS   = 2000;  // evita leitura dupla do mesmo toque
const uint32_t JANELA_CONFIRMACAO_MS  = 5000; 

//  Pinos
#define TRIG_PIN  6
#define ECHO_PIN  7

NewPing sonar(TRIG_PIN, ECHO_PIN, MAX_DISTANCIA_CM);
Adafruit_Fingerprint finger(&Serial2);

//  Guarda o status de cada ID: true = entrou, false = saiu
//  IDs válidos: 1–127 
bool     estadoUsuario[128]   = { false };
uint32_t ultimaLeituraDigital = 0;

// Pendente: digital lida aguardando confirmação do ultrassônico
int      idPendente           = -1;      // -1 = nenhum pendente
bool     tipoPendente         = false;   // false=entrada, true=saida
uint32_t tempoPendente        = 0;

uint32_t ultimaLeituraUltrassom = 0;
uint32_t ultimaPassagem         = 0;
bool     objetoNoLimiar         = false;

void emitirEvento(const char* evento, int biometriaId) {
  Serial.print(F("{\"evento\":\""));
  Serial.print(evento);
  Serial.print(F("\",\"biometriaId\":"));
  Serial.print(biometriaId);
  Serial.println(F("}"));
}

void taskFingerprint() {
  if (idPendente >= 0) return;

  uint32_t agora = millis();
  if (agora - ultimaLeituraDigital < DEBOUNCE_DIGITAL_MS) return;

  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK) return;
  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) return;

  p = finger.fingerSearch();
  if (p != FINGERPRINT_OK) {
    ultimaLeituraDigital = agora;
    return;
  }

  uint8_t id = finger.fingerID;
  ultimaLeituraDigital = agora;

  // Trava o sistema aguardando a passagem física
  idPendente    = id;
  tipoPendente  = estadoUsuario[id]; 
  tempoPendente = agora;
  
  Serial.println(F("Digital OK. Aguardando passagem..."));
}

void taskUltrassonico() {
  uint32_t agora = millis();
  if (agora - ultimaLeituraUltrassom < INTERVALO_ULTRASSOM_MS) return;
  ultimaLeituraUltrassom = agora;

  if (idPendente >= 0 && (agora - tempoPendente > JANELA_CONFIRMACAO_MS)) {
    idPendente = -1; // Cancela a entrada, a pessoa bateu o dedo mas não passou
    Serial.println(F("Passagem expirada."));
  }

  unsigned int distancia = sonar.ping_cm();
  bool objetoProximo = (distancia > 0 && distancia < LIMIAR_PRESENCA_CM);

  if (objetoProximo && !objetoNoLimiar) {
    objetoNoLimiar = true;
  }

  if (!objetoProximo && objetoNoLimiar && (agora - ultimaPassagem >= DEBOUNCE_PRESENCA_MS)) {
    objetoNoLimiar = false;
    ultimaPassagem = agora;

    if (idPendente >= 0) {
      const char* tipoEvento = tipoPendente ? "saida" : "entrada";
      estadoUsuario[idPendente] = !tipoPendente;
      
      emitirEvento(tipoEvento, idPendente);

      idPendente = -1; 
    }
  }
}

uint8_t cadastrarDigital(uint8_t id) {
  uint8_t p = -1;
  Serial.println(F("Encoste o dedo..."));
  while (p != FINGERPRINT_OK) { p = finger.getImage(); delay(50); }

  p = finger.image2Tz(1);
  if (p != FINGERPRINT_OK) { Serial.println(F("Falha imagem 1.")); return p; }
  Serial.println(F("Imagem 1 OK. Tire o dedo."));

  delay(1500);
  while (finger.getImage() != FINGERPRINT_NOFINGER) delay(50);

  Serial.println(F("Encoste o mesmo dedo novamente..."));
  p = -1;
  while (p != FINGERPRINT_OK) { p = finger.getImage(); delay(50); }

  p = finger.image2Tz(2);
  if (p != FINGERPRINT_OK) { Serial.println(F("Falha imagem 2.")); return p; }

  p = finger.createModel();
  if (p != FINGERPRINT_OK) {
    Serial.println(F("Leituras nao bateram. Tente de novo."));
    return p;
  }

  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.print(F("Digital #")); Serial.print(id); Serial.println(F(" armazenada!"));
  } else {
    Serial.println(F("Falha ao armazenar."));
  }
  return p;
}

void cadastrarFluxo() {
  Serial.println(F("\n--- CADASTRO (debug) ---"));
  Serial.print(F("Digite o ID (1-127) e ENTER: "));
  while (!Serial.available()) delay(10);
  int id = Serial.parseInt();
  while (Serial.available()) Serial.read();
  if (id < 1 || id > 127) { Serial.println(F("ID invalido.")); return; }
  Serial.print(F("\nCadastrando ID #")); Serial.println(id);
  cadastrarDigital((uint8_t)id);
  finger.getTemplateCount();
  Serial.print(F("Total: ")); Serial.println(finger.templateCount);
  Serial.println(F("--- fim ---\n"));
}

void apagarTudo() {
  Serial.println(F("\nApagando todas as digitais..."));
  if (finger.emptyDatabase() == FINGERPRINT_OK)
    Serial.println(F("Banco limpo.\n"));
  else
    Serial.println(F("Falha ao limpar.\n"));
}

void setup() {
  Serial.begin(9600);
  delay(400);

  Serial2.begin(FP_BAUD);
  finger.begin(FP_BAUD);
  delay(100);

  if (!finger.verifyPassword()) {
    Serial.println(F("AS608 nao encontrado"));
  } else {
    finger.getTemplateCount();
  }
}

void loop() {
  if (Serial.available()) {
    char cmd = (char)Serial.read();
    while (Serial.available()) Serial.read();
    switch (cmd) {
      case 'e': case 'E': cadastrarFluxo(); break;
      case 'd': case 'D': apagarTudo();     break;
      case 'u': case 'U': {
        unsigned int d = sonar.ping_cm();
        Serial.print(F("[HC-SR04] "));
        if (d > 0) { Serial.print(d); Serial.println(F(" cm")); }
        else         Serial.println(F("fora do alcance"));
        break;
      }
    }
  }

  taskUltrassonico();
  taskFingerprint();

  delay(20);
}