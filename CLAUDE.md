# Personal OS — CLAUDE.md

## Proyecto

Personal OS es una web app personal tipo PWA, modular y multiplataforma (Windows, Mac, iPhone). Funciona como un sistema operativo personal que centraliza finanzas, estudios, YouTube, AI y aprendizaje en un solo dashboard. Es para un solo usuario. No es un SaaS genérico.

## Stack

- **Framework:** Next.js (App Router)
- **Lenguaje:** TypeScript estricto. No usar JavaScript suelto ni CommonJS (require). Usar ES modules (import/export) y destructuring siempre.
- **Estilos:** Tailwind CSS + shadcn/ui. No instalar otras librerías de UI sin autorización.
- **Base de datos:** Supabase (Postgres + Auth + Storage + RLS).
- **Validación:** Zod para schemas y validación de inputs.
- **Data fetching:** React Query o Server Actions de Next.js.
- **Deploy:** Vercel.
- **Idioma de la UI:** Español (Chile). El código, variables, componentes y commits van en inglés.

## Estructura del proyecto

```
src/
├── app/                  # App Router de Next.js (páginas y layouts)
├── components/
│   ├── ui/               # Componentes reutilizables de shadcn/ui
│   ├── layout/           # Sidebar, Header, Shell del dashboard
│   └── shared/           # Componentes compartidos entre módulos
├── modules/
│   ├── finance/          # Módulo Finanzas (principal)
│   ├── study/            # Módulo Estudios (segundo más importante)
│   ├── youtube/          # Módulo YouTube (secundario)
│   ├── ai/               # Módulo AI (secundario)
│   └── learning/         # Módulo Aprendizaje (secundario)
├── lib/
│   ├── supabase/         # Cliente Supabase, types generados, helpers
│   └── utils/            # Utilidades generales
├── hooks/                # Custom hooks
├── types/                # Tipos globales de TypeScript
└── styles/               # Estilos globales y CSS variables
docs/
├── design/               # Capturas del diseño aprobado (Dashboard, Finanzas, Estudios)
├── prd.md                # Product Requirements Document
└── schema.md             # Esquema de base de datos documentado
prompts/                  # Prompts útiles reutilizables
```

## Base de datos (Supabase)

Proyecto: `personal-os` en Supabase. Región: West US (North California).
RLS activado en todas las tablas. Cada tabla tiene `user_id` referenciando `profiles.id`.

### Tablas V1

**profiles**
| Campo | Tipo | Descripción |
|---|---|---|
| id | uuid (PK) | Mismo ID del usuario autenticado |
| display_name | text | Nombre visible |
| timezone | text (default 'America/Santiago') | Zona horaria |
| currency_code | text (default 'CLP') | Moneda principal |
| created_at | timestamptz | Fecha de creación |

**income_entries**
| Campo | Tipo | Descripción |
|---|---|---|
| id | uuid (PK) | Identificador |
| user_id | uuid (FK → profiles) | Dueño |
| source | text (not null) | Fuente: YouTube, Facebook, otro |
| channel_name | text | Canal o cuenta |
| amount_original | numeric(12,2) | Monto en moneda original |
| currency_original | text | Moneda del pago (USD, EUR, etc.) |
| amount_clp | numeric(12,2) | Monto convertido a CLP |
| payment_date | date (not null) | Fecha de pago o cobro |
| status | text (default 'received') | pending / received |
| method | text | Método de cobro (banco, Wise, etc.) |
| notes | text | Observaciones |
| created_at | timestamptz | Fecha de registro |

**expense_entries**
| Campo | Tipo | Descripción |
|---|---|---|
| id | uuid (PK) | Identificador |
| user_id | uuid (FK → profiles) | Dueño |
| category | text | Categoría del gasto |
| amount | numeric(12,2) | Monto |
| currency_code | text | Moneda |
| expense_date | date (not null) | Fecha del gasto |
| description | text | Descripción |
| created_at | timestamptz | Fecha de registro |

**tasks**
| Campo | Tipo | Descripción |
|---|---|---|
| id | uuid (PK) | Identificador |
| user_id | uuid (FK → profiles) | Dueño |
| title | text (not null) | Título de la tarea |
| module | text | Módulo origen (finanzas, estudios, sistema) |
| priority | text (default 'medium') | low / medium / high |
| status | text (default 'open') | open / in_progress / done |
| due_date | date | Fecha límite |
| notes | text | Notas |
| created_at | timestamptz | Fecha de registro |

**study_items**
| Campo | Tipo | Descripción |
|---|---|---|
| id | uuid (PK) | Identificador |
| user_id | uuid (FK → profiles) | Dueño |
| title | text (not null) | Nombre de la evaluación o trabajo |
| course | text | Ramo (Big Data, Gestión Ágil, etc.) |
| type | text | exam / assignment / project |
| status | text (default 'open') | open / in_progress / done |
| due_date | date | Fecha de entrega |
| next_step | text | Próxima acción sugerida |
| resource_link | text | Enlace a material |
| created_at | timestamptz | Fecha de registro |

**activity_items**
| Campo | Tipo | Descripción |
|---|---|---|
| id | uuid (PK) | Identificador |
| user_id | uuid (FK → profiles) | Dueño |
| module | text | youtube / ai / learning |
| title | text | Título del item activo |
| subtitle | text | Contexto breve |
| status_text | text | Estado legible |
| context_text | text | Información adicional |
| primary_action_label | text | Label del botón principal |
| secondary_action_label | text | Label del botón secundario |
| link_target | text | URL o ruta destino |
| updated_at | timestamptz | Última actualización |

### Seguridad

- RLS activado en todas las tablas.
- Política base: `user_id = auth.uid()` para SELECT, INSERT, UPDATE, DELETE.
- Claves privadas solo en `.env.local`, nunca en el frontend.
- La anon key va en el cliente; la service_role key solo en server actions o API routes.
- Automatically expose new tables: DESACTIVADO.

## Diseño visual

### Dirección estética: V5+ · Editorial refinado

- **Tema:** Oscuro premium. Fondo muy oscuro, no negro puro.
- **Glow:** Visible y elegante, no neón ni gamer. Presente en bordes de cards, halos, fondos luminosos.
- **Cards:** Llamativas, con gradientes internos suaves, bandas de luz y tipografía KPI grande y clara.
- **Tipografía:** Moderna, limpia. Números grandes para KPIs, labels pequeños y muted para secundarios.
- **Profundidad:** Cards flotando sobre el fondo con sombras sutiles y superficies diferenciadas.

### Sistema de color por módulo

| Módulo | Color de acento | Uso |
|---|---|---|
| Dashboard | Azul grisáceo / blanco frío | Vista general |
| Finanzas | Verde / teal | Glow, íconos, highlights financieros |
| Estudios | Azul / cian suave | Identidad académica |
| YouTube | Rojo coral | Energía creativa |
| AI | Violeta / azul eléctrico suave | Herramientas y modelos |
| Aprendizaje | Verde oliva / amarillo suave | Crecimiento personal |
| Configuración | Gris neutro | Sistema y ajustes |

El color NO pinta toda la interfaz. Solo vive en glow, íconos, tags, headers y acentos del módulo activo.

### Sidebar

- Compacta, no debe verse larga ni vacía.
- Fondo muy oscuro, casi negro con matiz azul.
- Bloques tipo panel con bordes redondeados.
- Item activo con glow sutil y profundidad.
- Secciones agrupadas: SISTEMA (Dashboard, Finanzas, Estudios, YouTube) / INTELIGENCIA (AI, Aprendizaje) / SISTEMA (Configuración al fondo como ancla).
- Íconos minimalistas alineados por módulo.

### Referencia visual

Ver capturas del diseño aprobado en `docs/design/`:
- `dashboard.png` — Dashboard V5+ aprobado
- `finanzas.png` — Vista Finanzas completa
- `estudios.png` — Vista Estudios aprobada
- `sidebar.png` — Sidebar compacta aprobada

## Jerarquía de módulos

1. **Finanzas** — Módulo principal. Más protagonismo visual, más profundidad, más espacio.
2. **Estudios** — Segundo módulo más importante.
3. **YouTube** — Secundario pero importante para flujo creativo.
4. **AI** — Secundario.
5. **Aprendizaje** — Secundario.

## Dashboard — Especificación funcional

### Hero section (cabecera)
- NO usar mensaje de saludo tipo "Buenos días".
- Usar label tipo LIVE OVERVIEW o SYSTEM ACTIVE.
- Fecha + estado del sistema.
- Acciones rápidas contextuales (ej: cerrar conciliación, continuar lección, prioridad actual).
- Glow visible, gradientes, presencia de hero card premium.

### Cards principales (Finanzas)
| Card | Qué muestra | Click abre |
|---|---|---|
| Evolución de ingresos | Gráfico 12 meses | Modal grande con filtros y comparación |
| Gastos del mes | Resumen + comparación | Panel lateral con desglose por categoría |
| Balance general | Resultado neto + runway | Panel lateral con composición |
| Próximos cobros | Pagos pendientes por recibir | Ventana emergente pequeña |

### Cards de detalle
| Card | Click abre |
|---|---|
| Fuentes de ingreso | Ventana emergente pequeña con detalle por fuente |
| Movimientos recientes | Click por item → popover; "Ver todos" → módulo completo |

### Pendientes del día
- Lista de tareas con checkbox, título, módulo, prioridad, estado.
- Checkbox cambia estado directamente.
- Click en título → ventana emergente pequeña con detalle y acciones.

### En curso (módulos secundarios)
- YouTube: guion activo + botones (continuar guión, ideas, archivos).
- AI: sesión activa + botones (reanudar chat, Claude, Codex, + nuevo).
- Aprendizaje: nota actual + botones (abrir nota, siguiente paso, todas las notas).
- Acciones principales → abren directo. Acciones de apoyo → ventana emergente pequeña.

### Estudios (en Dashboard)
- Próximas evaluaciones con fecha y tiempo restante (NO barras de progreso).
- Trabajos en curso con fecha de entrega y estado.
- Archivos recientes con acceso rápido.
- Click en cada item → ventana emergente pequeña.

## Reglas de diseño importantes

- NO usar barras de progreso en Estudios (no sirven para el uso real).
- NO crear KPIs decorativos. Solo métricas que ayuden a entender, decidir o actuar.
- NO hacer dashboards genéricos tipo SaaS corporativo.
- NO sobrecargar vistas con demasiada información simultánea.
- Escritura es función principal en YouTube, no secundaria.
- Estudios prioriza materias y recursos, no actividad por todos lados.
- Cards de módulos secundarios deben ser funcionales, no "tarjetas bonitas con stats".
- Estados vacíos, errores y carga deben diseñarse desde el inicio.

## Módulo Finanzas — Vista completa

- Hero con identidad visual propia (ícono, glow verde/teal, título, acciones + ingreso / + gasto).
- KPIs superiores: ingresos del mes, gastos del mes, balance, ahorro/flujo neto.
- Gráfico principal de ingresos en el tiempo (protagonista).
- Gráfico secundario de gastos por categoría.
- Fuentes de ingreso con desglose por origen.
- Tabla de movimientos recientes (premium, no genérica).
- Filtros por fecha, categoría, fuente y estado.

## Módulo Estudios — Vista completa

- Hero con identidad visual propia (ícono, glow azul/cian).
- Materias como cards simplificadas (nombre, ícono, contexto breve, próximo hito, botón abrir). Máximo 3 datos visibles por tarjeta.
- Biblioteca resumida a la izquierda.
- "En foco" compacto a la derecha (próximo + foco de la semana).
- Actividad reciente escondida detrás de "ver actividad".
- NO parecer plataforma escolar genérica.

## Módulo YouTube — Vista completa

- Hero con identidad visual propia (ícono, glow rojo coral).
- Sección de ideas.
- Borradores y guiones con editor integrado para escribir directamente.
- Videos publicados en el mes.
- Último video + análisis AI del rendimiento (qué funciona, qué no, recomendación).
- Escritura es función principal del módulo.

## Comandos

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build de producción
npm run build

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## Convenciones

- Commits en inglés, estilo convencional: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`.
- Branches: `feat/nombre`, `fix/nombre`, `refactor/nombre`.
- Componentes en PascalCase. Hooks con prefijo `use`. Archivos en kebab-case.
- Un componente por archivo.
- No dejar console.log en producción.
- Cada módulo es independiente dentro de `src/modules/`. No crear dependencias cruzadas entre módulos.

## Variables de entorno requeridas

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Las dos primeras van en el cliente. La tercera SOLO en server actions o API routes.
