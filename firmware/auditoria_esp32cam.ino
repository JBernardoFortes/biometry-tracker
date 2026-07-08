#include "esp_camera.h"
#include <WiFi.h>
#include <HTTPClient.h>

// Intervalo de auditoria aleatória
const uint32_t AUDIT_MIN_MS = 1UL * 1000UL;    // 1 segundo
const uint32_t AUDIT_MAX_MS = 10UL * 1000UL;    // 10 segundos

const char* WIFI_SSID     = "Rede_Auditoria";
const char* WIFI_PASSWORD = "senha1234";

const char* SERVER_HOST = "10.42.0.1"; 
const int   SERVER_PORT = 8000;
const char* SERVER_PATH = "/evento/imagem";

// =====================================================================
//  PINOUT CÂMERA — AI Thinker ESP32-CAMs
// =====================================================================
#define CAM_PIN_PWDN    32
#define CAM_PIN_RESET   -1
#define CAM_PIN_XCLK     0
#define CAM_PIN_SIOD    26
#define CAM_PIN_SIOC    27
#define CAM_PIN_D7      35
#define CAM_PIN_D6      34
#define CAM_PIN_D5      39
#define CAM_PIN_D4      36
#define CAM_PIN_D3      21
#define CAM_PIN_D2      19
#define CAM_PIN_D1      18
#define CAM_PIN_D0       5
#define CAM_PIN_VSYNC   25
#define CAM_PIN_HREF    23
#define CAM_PIN_PCLK    22

uint32_t proximaAuditoria = 0;
uint32_t contadorEventos  = 0;

bool iniciarCamera() {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer   = LEDC_TIMER_0;
  config.pin_d0       = CAM_PIN_D0;
  config.pin_d1       = CAM_PIN_D1;
  config.pin_d2       = CAM_PIN_D2;
  config.pin_d3       = CAM_PIN_D3;
  config.pin_d4       = CAM_PIN_D4;
  config.pin_d5       = CAM_PIN_D5;
  config.pin_d6       = CAM_PIN_D6;
  config.pin_d7       = CAM_PIN_D7;
  config.pin_xclk     = CAM_PIN_XCLK;
  config.pin_pclk     = CAM_PIN_PCLK;
  config.pin_vsync    = CAM_PIN_VSYNC;
  config.pin_href     = CAM_PIN_HREF;
  config.pin_sscb_sda = CAM_PIN_SIOD;
  config.pin_sscb_scl = CAM_PIN_SIOC;
  config.pin_pwdn     = CAM_PIN_PWDN;
  config.pin_reset    = CAM_PIN_RESET;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size   = FRAMESIZE_UXGA;  // 1600 × 1200
  config.jpeg_quality = 12;
  config.fb_count     = 1;

  if (esp_camera_init(&config) != ESP_OK) {
    Serial.println("[Camera] Falha na inicializacao.");
    return false;
  }
  Serial.println("[Camera] OK");
  return true;
}


void agendarProximaAuditoria() {
  uint32_t intervalo = AUDIT_MIN_MS + random(AUDIT_MAX_MS - AUDIT_MIN_MS);

  proximaAuditoria = millis() + intervalo;
  Serial.printf("[Auditoria] Proxima em %.0f s\n\n", intervalo / 1000.0);
}


void enviarEvento(camera_fb_t* fb) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[HTTP] Erro: WiFi desconectado.");
    return;
  }

  WiFiClient client;
  Serial.printf("[HTTP] Conectando a %s:%d...\n", SERVER_HOST, SERVER_PORT);

  if (!client.connect(SERVER_HOST, SERVER_PORT)) {
    Serial.println("[HTTP] Falha ao conectar no servidor.");
    return;
  }

  String boundary = "----ESP32CamBoundary123";
  
  String head = "--" + boundary + "\r\n";
  head += "Content-Disposition: form-data; name=\"imagem\"; filename=\"auditoria.jpg\"\r\n";
  head += "Content-Type: image/jpeg\r\n\r\n";
  
  String tail = "\r\n--" + boundary + "--\r\n";

  uint32_t contentLength = head.length() + fb->len + tail.length();

  client.print(String("POST ") + SERVER_PATH + " HTTP/1.1\r\n");
  client.print(String("Host: ") + SERVER_HOST + "\r\n");
  client.print("Content-Length: " + String(contentLength) + "\r\n");
  client.print("Content-Type: multipart/form-data; boundary=" + boundary + "\r\n");
  client.print("\r\n");

  client.print(head);

  // Pra evitar o erro de "out of memory" ou falha no Watchdog da ESP32
  // envia em chunks
  uint8_t *fbBuf = fb->buf;
  size_t fbLen = fb->len;
  for (size_t n = 0; n < fbLen; n = n + 1024) {
    if (n + 1024 < fbLen) {
      client.write(fbBuf, 1024);
      fbBuf += 1024;
    } else if (fbLen % 1024 > 0) {
      size_t remainder = fbLen % 1024;
      client.write(fbBuf, remainder);
    }
  }

  client.print(tail);

  Serial.print("[HTTP] Resposta do backend: ");
  long tempoInicio = millis();
  bool respostaRecebida = false;
  
  while ((millis() - tempoInicio) < 5000) { 
    while (client.available()) {
      char c = client.read();
      Serial.print(c);
      respostaRecebida = true;
    }

    if (respostaRecebida && !client.available()) {
      break; 
    }
    delay(10);
  }
  
  client.stop();
}


void setup() {
  Serial.begin(115200);
  delay(400);
  Serial.println("\n=== Auditoria ESP32-CAM ===");

  if (!iniciarCamera()) {
    Serial.println("Reiniciando em 5s...");
    delay(5000);
    ESP.restart();
  }

  Serial.printf("[WiFi] Conectando a %s", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  uint8_t t = 0;
  while (WiFi.status() != WL_CONNECTED && t < 20) {
    delay(500); Serial.print("."); t++;
  }
  if (WiFi.status() == WL_CONNECTED)
    Serial.printf("\n[WiFi] IP: %s\n", WiFi.localIP().toString().c_str());
  else
    Serial.println("\n[WiFi] Falha na conexao.");

  randomSeed(esp_random());
  agendarProximaAuditoria();
}


void loop() {
  if (millis() < proximaAuditoria) {
    delay(40);
    return;
  }

  Serial.println("[Auditoria] Disparando captura...");

  camera_fb_t* fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("[Camera] Falha ao capturar frame.");
    agendarProximaAuditoria();
    return;
  }

  enviarEvento(fb);

  esp_camera_fb_return(fb);
  agendarProximaAuditoria();
}
