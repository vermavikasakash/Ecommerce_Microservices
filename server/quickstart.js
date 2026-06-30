#!/usr/bin/env node

/**
 * Quick Start Guide for eCommerce Microservices
 * 
 * This script provides instructions for running the microservices architecture
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.blue}${msg}${colors.reset}\n`),
};

const verifyServices = () => {
  log.title("Verifying Microservices Structure");

  const services = ["gateway", "product", "cart", "order", "payment"];
  const basePath = path.join(__dirname, "services");

  let allValid = true;

  services.forEach((service) => {
    const servicePath = path.join(basePath, service);
    const mainFile = path.join(servicePath, `${service}.js`);

    if (fs.existsSync(mainFile)) {
      log.success(`${service} service`);
    } else {
      log.error(`${service} service - main file missing`);
      allValid = false;
    }
  });

  // Check shared utilities
  const sharedPath = path.join(basePath, "shared");
  if (fs.existsSync(path.join(sharedPath, "config"))) {
    log.success(`Shared config`);
  } else {
    allValid = false;
  }

  if (fs.existsSync(path.join(sharedPath, "middleware"))) {
    log.success(`Shared middleware`);
  } else {
    allValid = false;
  }

  if (fs.existsSync(path.join(sharedPath, "utils"))) {
    log.success(`Shared utils`);
  } else {
    allValid = false;
  }

  return allValid;
};

const checkDependencies = () => {
  log.title("Checking Dependencies");

  try {
    execSync("npm list express > nul 2>&1", { stdio: "pipe" });
    log.success("Express installed");
  } catch (e) {
    log.warn("Express not installed - run: npm install");
  }

  try {
    execSync("npm list cors > nul 2>&1", { stdio: "pipe" });
    log.success("CORS installed");
  } catch (e) {
    log.warn("CORS not installed - run: npm install");
  }
};

const printQuickStart = () => {
  log.title("Quick Start Guide");

  console.log("1. Install dependencies:");
  console.log(`   ${colors.yellow}npm install${colors.reset}\n`);

  console.log("2. Start all services (recommended):");
  console.log(`   ${colors.yellow}npm run dev${colors.reset}`);
  console.log(`   This runs: Gateway + all 4 microservices + frontend\n`);

  console.log("3. Or start services individually:");
  console.log(`   ${colors.yellow}npm run gateway${colors.reset}           # Terminal 1`);
  console.log(`   ${colors.yellow}npm run product-service${colors.reset}   # Terminal 2`);
  console.log(`   ${colors.yellow}npm run cart-service${colors.reset}      # Terminal 3`);
  console.log(`   ${colors.yellow}npm run order-service${colors.reset}     # Terminal 4`);
  console.log(`   ${colors.yellow}npm run payment-service${colors.reset}   # Terminal 5\n`);

  console.log("4. Or use Docker:");
  console.log(`   ${colors.yellow}docker-compose up --build${colors.reset}\n`);
};

const printServiceEndpoints = () => {
  log.title("Service Endpoints");

  const endpoints = [
    { service: "API Gateway", port: 8080, url: "http://localhost:8080" },
    { service: "Product Service", port: 8081, url: "http://localhost:8081" },
    { service: "Cart Service", port: 8082, url: "http://localhost:8082" },
    { service: "Order Service", port: 8083, url: "http://localhost:8083" },
    { service: "Payment Service", port: 8084, url: "http://localhost:8084" },
    { service: "Frontend", port: 3000, url: "http://localhost:3000" },
  ];

  endpoints.forEach(({ service, port, url }) => {
    console.log(`${colors.cyan}${service.padEnd(18)}${colors.reset} ${port.toString().padEnd(5)} ${url}`);
  });

  console.log("\nTest a service:");
  console.log(`${colors.yellow}curl http://localhost:8080/health${colors.reset}`);
  console.log(`${colors.yellow}curl http://localhost:8081/health${colors.reset}\n`);
};

const printDataFlow = () => {
  log.title("Data Flow Example: Create Order");

  console.log(`
Client Request
  ↓
POST /api/orders
  ↓
API Gateway (Port 8080)
  ├─ Routes to Order Service
  ↓
Order Service (Port 8083)
  ├─ Calls Cart Service for items
  ├─ Calls Payment Service to verify Razorpay payment
  ├─ Creates order record
  ├─ Calls Cart Service to clear cart
  └─ Returns order confirmation
  ↓
Client Response
{
  "success": true,
  "message": "Order placed successfully",
  "order": {
    "id": "ord_1234567890",
    "status": "confirmed",
    "total": 29997,
    "items": [...]
  }
}
  `);
};

const printTroubleshooting = () => {
  log.title("Troubleshooting");

  console.log(`${colors.yellow}Port already in use?${colors.reset}`);
  console.log(`Kill the process on the port:
  Windows: ${colors.cyan}netstat -ano | findstr :8080${colors.reset}
           ${colors.cyan}taskkill /PID <pid> /F${colors.reset}
  Mac:     ${colors.cyan}lsof -ti:8080 | xargs kill -9${colors.reset}
  Linux:   ${colors.cyan}lsof -ti:8080 | xargs kill -9${colors.reset}\n`);

  console.log(`${colors.yellow}Services not starting?${colors.reset}`);
  console.log(`Check .env file has correct service URLs
  See: .env.example for template\n`);

  console.log(`${colors.yellow}Services can't communicate?${colors.reset}`);
  console.log(`Ensure all services are running on their ports
  Test with: ${colors.cyan}curl http://localhost:<port>/health${colors.reset}\n`);
};

const printArchitecture = () => {
  log.title("Architecture Overview");

  console.log(`
Monolithic → Microservices Conversion

${colors.bright}BEFORE:${colors.reset}
┌─────────────────────────────┐
│  Monolithic API             │
│  (Products, Cart, Orders,   │
│   Payments - all mixed)     │
└─────────────────────────────┘

${colors.bright}AFTER:${colors.reset}
┌────────────────────────────────────────────────────────────┐
│            API Gateway (Port 8080)                         │
│  Routing, Customer Context, Error Handling                │
└──────────┬────────┬────────┬────────┬──────────────────────┘
           │        │        │        │
    ┌──────▼┐ ┌─────▼┐ ┌────▼┐ ┌────▼┐
    │ Prod. │ │ Cart │ │Order│ │Pay. │
    │ 8081  │ │ 8082 │ │8083 │ │8084 │
    └───────┘ └──────┘ └─────┘ └─────┘

Benefits:
  ✓ Independent deployment
  ✓ Technology flexibility
  ✓ Scalability per service
  ✓ Team autonomy
  ✓ Fault isolation
  `);
};

// Main execution
console.clear();
log.title("🚀 eCommerce Microservices Quick Start");

if (verifyServices()) {
  log.success("All services verified!");
} else {
  log.error("Some services are missing");
}

checkDependencies();
printQuickStart();
printServiceEndpoints();
printDataFlow();
printArchitecture();
printTroubleshooting();

console.log(`\n${colors.bright}${colors.green}Ready to go! Follow the Quick Start steps above.${colors.reset}\n`);
