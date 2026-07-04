# SIPA - Sistema Integrado de Presença de ALunos

Sistema de controle de frequência escolar por biometria, utilizando **Arduino Mega**, **ESP32-CAM**, **Sensor biométrico AS608** e **Sensor ultrassônico HC-SR04**.

## Visão Geral

O projeto é dividido em duas frentes:

### Firmware (`firmware/`)

Código para os microcontroladores responsáveis pela captura presencial:

- **Arduino Mega** (`main_loop_arduino.ino`)
  - **AS608 (leitor de digital)**: Aluno encosta o dedo para registrar entrada/saída. O sensor busca a digital cadastrada e alterna o estado (presente/ausente) do ID correspondente.
  - **HC-SR04 (ultrassônico)**: Detecta a passagem de pessoas por uma porta. Funciona como validação auxiliar para garantir que há alguém presente no momento da leitura.
  - Interface serial para **debug**:  cadastro (`e`), limpeza de digitais (`d`) e teste do ultrassônico (`u`).

- **ESP32-CAM** (`auditoria_esp32cam.ino`)
  - Realiza capturas fotográficas em intervalos aleatórios para auditoria.
  - Conecta-se à rede Wi-Fi e envia as imagens (JPEG) a um servidor.

### Web App (`src/`)

Interface web construída com **React 19 + TypeScript + Vite + TailwindCSS 4**:

- **Turmas** — Listagem de turmas com turno, dias da semana e horários.
- **Alunos** — Visualização de alunos por turma com status de presença por data.
- **Calendário** — Seleção de datas para consultar registros históricos.
- **Histórico** — Registro de entrada/saída dos alunos no dia selecionado.
- **Auditoria** — Modal de visualização das fotos capturadas pela ESP32-CAM.


## Estrutura do Projeto

```
├── firmware/
│   ├── main_loop_arduino.ino   # Código do Arduino Mega (AS608 + HC-SR04)
│   └── auditoria_esp32cam.ino  # Código da ESP32-CAM (captura de imagens)
├── src/
│   ├── components/
│   │   ├── layout/MainLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── ui/
│   │       ├── Calendar.tsx
│   │       ├── ClassPageHeader.tsx
│   │       ├── Historic.tsx
│   │       ├── PhotoVerificationModal.tsx
│   │       ├── Students.tsx
│   │       └── StudentsList.tsx
│   ├── mocks/mock.ts
│   ├── pages/
│   │   ├── ClassPage.tsx
│   │   └── ClassesPage.tsx
│   ├── routes/AppRoutes.tsx
│   ├── services/api.ts
│   └── types/index.ts
├── package.json
└── vite.config.ts
```

## Hardware

| Componente         | Função                          | Conexão                |
|--------------------|---------------------------------|------------------------|
| Arduino Mega       | Controlador principal           | —                      |
| AS608              | Leitor de impressão digital     | Serial2 (pinos 16/17)  |
| HC-SR04            | Sensor de distância ultrassônico| Trigger: 6, Echo: 7    |
| ESP32-CAM          | Câmera para auditoria           | Wi-Fi + GPIO (AI Thinker pinout) |

## Desenvolvimento da Aplicação Web

```bash
# Instalar dependências do frontend
npm install

# Servidor de desenvolvimento
npm run dev
```