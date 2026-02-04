---
trigger: always_on
---

# Angular Project Rules (Best Practices)

## 🔹 Arquitectura y Organización
- Usa **módulos feature** y **lazy loading** para dividir la aplicación en secciones claras.
- Prefiere **Standalone Components** (Angular 15+) cuando no requieras módulos grandes.
- Mantén una **estructura de carpetas por dominio** (`auth/`, `dashboard/`, `shared/`).

## 🔹 Tipado y Consistencia
- Habilita **TypeScript strict mode** y evita el uso de `any`.
- Define **interfaces y tipos** para modelos de datos.
- Usa convenciones de nombres:
  - **PascalCase** para clases y componentes.
  - **camelCase** para variables y métodos.

## 🔹 Componentes y Servicios
- Aplica el **principio de responsabilidad única**: un componente = una función clara.
- Mueve la lógica de negocio a **servicios inyectables**.
- Usa `async pipe` en templates para manejar observables y evitar memory leaks.

## 🔹 RxJS y Estado
- Controla observables con operadores como `takeUntil` o `firstValueFrom`.
- Usa **NgRx** o **Signals** para manejar estado en aplicaciones grandes.
- Evita lógica compleja en templates; usa pipes o servicios.

## 🔹 Rendimiento
- Configura `ChangeDetectionStrategy.OnPush` en componentes.
- Usa `trackBy` en `*ngFor` para listas grandes.
- Implementa **lazy load** de imágenes y módulos.

## 🔹 Seguridad
- Sanitiza contenido dinámico con `DomSanitizer`.
- Protege rutas con **guards** (`AuthGuard`, `RoleGuard`).
- Usa **HTTPS** y tokens JWT para autenticación con Supabase.

## 🔹 Testing y Calidad
- Implementa **unit tests** con Jasmine/Karma o Jest.
- Usa **E2E tests** con Cypress o Playwright.
- Configura **ESLint + Prettier** para mantener estilo y calidad.

## 🔹 Documentación y Mantenimiento
- Documenta servicios y componentes críticos.
- Mantén un **README actualizado** con instrucciones de instalación y despliegue.
- Usa una **checklist de buenas prácticas** en revisiones de código.

