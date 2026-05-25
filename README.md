# Personal OS

![Status](https://img.shields.io/badge/status-in%20development-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

Tu sistema operativo personal que centraliza tu vida digital en un solo lugar.

---

## Que es Personal OS?

**Personal OS** es un dashboard web que integra todas tus herramientas, datos y proyectos en una unica plataforma. Piensa en el como el centro de control de tu vida digital.

## Modulos

### Finanzas

- Tracking de ingresos y gastos
- Presupuesto mensual y anual
- Graficos de distribucion de gastos
- Integracion con Excel/CSV
- Proyecciones financieras

### YouTube

- Metricas del canal (vistas, suscriptores, RPM/CPM)
- Calendario de publicacion
- Analisis de rendimiento por video
- Tracking de monetizacion
- Competidor monitoring

### Proyectos

- Kanban board de tareas
- Sistema de prioridades
- Tracking de progreso
- Roadmap de objetivos

### Obsidian Integration

- Enlace con tu vault de conocimiento
- Busqueda rapida de notas
- Grafico de conexiones
- Backlinks entre ideas

### API Layer

- REST API para conectar modulos
- Webhooks para notificaciones
- Integracion con servicios externos

---

## Stack Tecnologico

- **Frontend:** React + TypeScript + Tailwind CSS
- **Estado:** Zustand o Context API
- **Graficos:** Recharts
- **Backend:** Node.js + Express (en desarrollo)
- **Base de datos:** SQLite (local) / PostgreSQL (cloud)
- **Build tool:** Vite

---

## Instalacion

### 1. Clonar el repositorio

```bash
git clone https://github.com/Darkt1121/personal-os.git
cd personal-os
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

### 4. Construir para produccion

```bash
npm run build
```

---

## Estructura del Proyecto

```
personal-os/
  src/
    components/      # Componentes reutilizables
    hooks/           # Custom hooks
    modules/         # Modulos principales
      finanzas/
      youtube/
      proyectos/
      obsidian/
    pages/           # Paginas principales
    styles/          # Estilos globales
    utils/           # Utilidades
  public/            # Assets estaticos
  config/            # Configuracion
  scripts/           # Scripts de utilidad
  docs/              # Documentacion
```

---

## Roadmap

- [x] Crear repositorio
- [x] Configurar estructura basica del proyecto
- [ ] Configurar React + TypeScript + Tailwind
- [ ] Implementar modulo de Finanzas
- [ ] Implementar modulo de YouTube
- [ ] Implementar modulo de Proyectos
- [ ] Implementar integracion con Obsidian
- [ ] Implementar API layer
- [ ] Desplegar en GCP

---

## Licencia

MIT License - ver [LICENSE](LICENSE) para mas detalles.

---

> Construido con passion por Darkt1121 | Santiago, Chile
