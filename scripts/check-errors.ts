/**
 * LIKEFOOD - Error Check Tool
 * Script kiểm tra toàn bộ lỗi của dự án
 * Run: npx tsx scripts/check-errors.ts
 */

import { execSync } from "child_process";
import chalk from "chalk";

interface CheckResult {
  name: string;
  status: "pass" | "fail" | "warning";
  message: string;
  duration?: string;
}

const results: CheckResult[] = [];

function runCheck(name: string, command: string, expectedExitCode = 0): void {
  const start = Date.now();
  console.log(chalk.blue(`\n🔍 Running: ${name}...`));
  
  try {
    execSync(command, { 
      stdio: "pipe", 
      encoding: "utf-8",
      cwd: process.cwd()
    });
    const duration = Date.now() - start;
    results.push({
      name,
      status: "pass",
      message: "✓ Passed",
      duration: `${duration}ms`
    });
    console.log(chalk.green(`   ✓ Passed (${duration}ms)`));
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    const duration = Date.now() - start;
    const exitCode = err.status ?? 1;
    
    if (exitCode === expectedExitCode) {
      results.push({
        name,
        status: "pass",
        message: "✓ Passed",
        duration: `${duration}ms`
      });
      console.log(chalk.green(`   ✓ Passed (${duration}ms)`));
    } else {
      results.push({
        name,
        status: "fail",
        message: err.message?.slice(0, 200) || "Failed",
        duration: `${duration}ms`
      });
      console.log(chalk.red(`   ✗ Failed (${duration}ms)`));
    }
  }
}

function printSummary(): void {
  console.log(chalk.bold("\n" + "=".repeat(60)));
  console.log(chalk.bold("           KIỂM TRA LỖI DỰ ÁN - TỔNG KẾT"));
  console.log(chalk.bold("=".repeat(60)));
  
  const passed = results.filter(r => r.status === "pass").length;
  const failed = results.filter(r => r.status === "fail").length;
  const warnings = results.filter(r => r.status === "warning").length;
  
  console.log(chalk.green(`\n  ✓ Passed:  ${passed}`));
  console.log(chalk.red(`  ✗ Failed:  ${failed}`));
  console.log(chalk.yellow(`  ⚠ Warnings: ${warnings}`));
  
  if (failed > 0) {
    console.log(chalk.bold("\n  ❌ FAILED CHECKS:"));
    results
      .filter(r => r.status === "fail")
      .forEach(r => {
        console.log(chalk.red(`     - ${r.name}: ${r.message}`));
      });
  }
  
  console.log(chalk.bold("\n" + "=".repeat(60)));
  
  if (failed === 0) {
    console.log(chalk.green.bold("  🎉 TẤT CẢ KIỂM TRA ĐÃ PASS!"));
  } else {
    console.log(chalk.red.bold(`  ❌ CÓ ${failed} LỖI CẦN SỬA`));
  }
  console.log(chalk.bold("=".repeat(60)) + "\n");
  
  // Return exit code
  process.exit(failed > 0 ? 1 : 0);
}

// Main execution
console.log(chalk.bold.cyan("\n🚀 LIKEFOOD - ERROR CHECK TOOL"));
console.log(chalk.gray("   Version: 1.0.0"));
console.log(chalk.gray("   Project: Vietnamese Specialty Marketplace\n"));

// 1. TypeScript Check
runCheck("TypeScript Check", "npx tsc --noEmit", 0);

// 2. ESLint Check
runCheck("ESLint Check", "npx eslint src --ext .ts,.tsx --ignore-pattern 'src/generated/**' --quiet", 0);

// 3. Next.js Build (dev mode check)
runCheck("Next.js Build (type-check only)", "npx next build --no-lint", 0);

// Print summary
printSummary();
