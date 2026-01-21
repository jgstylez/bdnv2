---
name: Monitoring & Observability Strategy - Logging, Alerting, Metrics
overview: Comprehensive monitoring and observability strategy covering centralized logging, alerting thresholds and escalation, performance monitoring (APM), cost monitoring, and operational dashboards.
todos:
  - id: setup-centralized-logging
    content: Set up centralized logging with Google Cloud Logging
    status: pending
  - id: create-log-aggregation
    content: Create log aggregation and analysis system
    status: pending
  - id: setup-alerting-system
    content: Set up alerting system with PagerDuty/Slack integration
    status: pending
  - id: configure-alert-thresholds
    content: Configure alert thresholds and escalation policies
    status: pending
  - id: setup-apm
    content: Set up Application Performance Monitoring (APM)
    status: pending
  - id: setup-database-monitoring
    content: Set up database query monitoring and slow query alerts
    status: pending
  - id: setup-cost-monitoring
    content: Set up cloud cost tracking and budget alerts
    status: pending
  - id: create-operational-dashboards
    content: Create operational dashboards (Grafana/Cloud Monitoring)
    status: pending
  - id: setup-error-tracking
    content: Set up error tracking with Sentry integration
    status: pending
  - id: create-business-metrics-dashboards
    content: Create business metrics dashboards
    status: pending
---

# Monitoring & Observability Strategy

## Overview

This plan establishes comprehensive monitoring and observability for BDN 2.0, covering centralized logging, alerting, performance monitoring, cost tracking, and operational dashboards.

## 1. Centralized Logging

### Google Cloud Logging Integration

**File: `server/src/services/logger.ts`**

```typescript
import { Logging } from '@google-cloud/logging';
import { Severity } from '@google-cloud/logging/build/src/entry';

class CloudLogger {
  private logging: Logging;
  private log: any;

  constructor() {
    this.logging = new Logging({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });
    this.log = this.logging.log('bdn-backend');
  }

  async logEntry(
    severity: Severity,
    message: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const entry = this.log.entry(
      {
        severity,
        resource: {
          type: 'cloud_run_revision',
          labels: {
            service_name: 'bdn-backend',
            revision_name: process.env.K_REVISION || 'unknown',
          },
        },
        labels: {
          environment: process.env.NODE_ENV || 'development',
        },
      },
      {
        message,
        ...metadata,
        timestamp: new Date().toISOString(),
      }
    );

    await this.log.write(entry);
  }

  async info(message: string, metadata?: Record<string, any>): Promise<void> {
    await this.logEntry('INFO', message, metadata);
  }

  async warn(message: string, metadata?: Record<string, any>): Promise<void> {
    await this.logEntry('WARNING', message, metadata);
  }

  async error(message: string, error?: Error, metadata?: Record<string, any>): Promise<void> {
    await this.logEntry('ERROR', message, {
      ...metadata,
      error: {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
      },
    });
  }

  async debug(message: string, metadata?: Record<string, any>): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      await this.logEntry('DEBUG', message, metadata);
    }
  }
}

export const logger = new CloudLogger();
```

### Structured Logging Middleware

**File: `server/src/middleware/logging.ts`**

```typescript
import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/logger';
import { v4 as uuidv4 } from 'uuid';

export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = uuidv4();
  req.requestId = requestId;
  
  const startTime = Date.now();

  // Log request
  logger.info('HTTP Request', {
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: (req as any).user?.id,
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger[logLevel]('HTTP Response', {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      contentLength: res.get('content-length'),
    });
  });

  next();
}
```

### Log Retention Policy

**File: `server/logging-policy.yaml`**

```yaml
# Google Cloud Logging retention policy
retention_policies:
  # Application logs - 30 days
  - name: application-logs
    filter: 'resource.type="cloud_run_revision" AND severity>=INFO'
    retention_days: 30

  # Error logs - 90 days
  - name: error-logs
    filter: 'resource.type="cloud_run_revision" AND severity>=ERROR'
    retention_days: 90

  # Audit logs - 1 year (PCI compliance)
  - name: audit-logs
    filter: 'resource.type="cloud_run_revision" AND jsonPayload.type="audit"'
    retention_days: 365

  # Payment transaction logs - 1 year (compliance)
  - name: payment-logs
    filter: 'resource.type="cloud_run_revision" AND jsonPayload.category="payment"'
    retention_days: 365
```

## 2. Alerting System

### Alert Configuration

**File: `server/monitoring/alerts.yaml`**

```yaml
alerts:
  # High Error Rate
  - name: high-error-rate
    condition: |
      resource.type = "cloud_run_revision"
      AND severity >= "ERROR"
    threshold: 10 errors per 5 minutes
    notification_channels:
      - pagerduty
      - slack-alerts
    escalation:
      - delay: 5m
        notify: slack-alerts
      - delay: 15m
        notify: pagerduty-oncall

  # High Response Time
  - name: high-response-time
    condition: |
      resource.type = "cloud_run_revision"
      AND jsonPayload.duration > 2000
    threshold: 20 requests per 5 minutes
    notification_channels:
      - slack-alerts

  # Database Connection Issues
  - name: database-connection-errors
    condition: |
      resource.type = "cloud_run_revision"
      AND jsonPayload.message =~ ".*database.*connection.*"
    threshold: 5 errors per 5 minutes
    notification_channels:
      - pagerduty
      - slack-alerts

  # Payment Processor Errors
  - name: payment-processor-errors
    condition: |
      resource.type = "cloud_run_revision"
      AND jsonPayload.category = "payment"
      AND severity >= "ERROR"
    threshold: 1 error (immediate)
    notification_channels:
      - pagerduty-critical
      - slack-alerts

  # High Memory Usage
  - name: high-memory-usage
    condition: |
      resource.type = "cloud_run_revision"
      AND jsonPayload.memory.heapUsed > 1536
    threshold: sustained for 5 minutes
    notification_channels:
      - slack-alerts

  # Low Available Instances
  - name: low-instance-count
    condition: |
      resource.type = "cloud_run_revision"
      AND metric.type = "run.googleapis.com/container/instance_count"
      AND metric.value < 1
    threshold: sustained for 2 minutes
    notification_channels:
      - pagerduty
```

### Alert Manager Service

**File: `server/src/services/alert-manager.ts`**

```typescript
import { Monitoring } from '@google-cloud/monitoring';
import { logger } from './logger';

interface AlertConfig {
  name: string;
  condition: string;
  threshold: number;
  notificationChannels: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class AlertManager {
  private monitoring: Monitoring;
  private alertConfigs: AlertConfig[];

  constructor() {
    this.monitoring = new Monitoring({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });
    this.alertConfigs = this.loadAlertConfigs();
  }

  async createAlertPolicy(config: AlertConfig): Promise<void> {
    const policy = {
      displayName: config.name,
      conditions: [
        {
          displayName: `${config.name} condition`,
          conditionThreshold: {
            filter: config.condition,
            comparison: 'COMPARISON_GT',
            thresholdValue: config.threshold,
            duration: '300s', // 5 minutes
          },
        },
      ],
      notificationChannels: config.notificationChannels,
      alertStrategy: {
        autoClose: '1800s', // 30 minutes
        notificationRateLimit: {
          period: '300s',
        },
      },
    };

    await this.monitoring.createAlertPolicy({
      name: this.monitoring.projectPath(process.env.GOOGLE_CLOUD_PROJECT_ID || ''),
      alertPolicy: policy,
    });
  }

  async sendAlert(
    severity: 'low' | 'medium' | 'high' | 'critical',
    title: string,
    message: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    logger.error(`ALERT [${severity.toUpperCase()}]: ${title}`, {
      alert: {
        severity,
        title,
        message,
        ...metadata,
      },
    });

    // Send to notification channels based on severity
    if (severity === 'critical' || severity === 'high') {
      await this.sendToPagerDuty(title, message, metadata);
    }
    
    await this.sendToSlack(severity, title, message, metadata);
  }

  private async sendToPagerDuty(
    title: string,
    message: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    // PagerDuty integration
    // Implementation depends on PagerDuty API
  }

  private async sendToSlack(
    severity: string,
    title: string,
    message: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    // Slack webhook integration
    // Implementation depends on Slack API
  }

  private loadAlertConfigs(): AlertConfig[] {
    // Load from alerts.yaml
    return [];
  }
}

export const alertManager = new AlertManager();
```

## 3. Performance Monitoring (APM)

### Application Performance Monitoring

**File: `server/src/middleware/performance-monitoring.ts`**

```typescript
import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/logger';

interface PerformanceMetrics {
  endpoint: string;
  method: string;
  duration: number;
  statusCode: number;
  memoryUsage: NodeJS.MemoryUsage;
  timestamp: string;
}

export function performanceMonitoringMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now();
  const startMemory = process.memoryUsage();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const endMemory = process.memoryUsage();
    const memoryDelta = {
      rss: endMemory.rss - startMemory.rss,
      heapTotal: endMemory.heapTotal - startMemory.heapTotal,
      heapUsed: endMemory.heapUsed - startMemory.heapUsed,
    };

    const metrics: PerformanceMetrics = {
      endpoint: req.path,
      method: req.method,
      duration,
      statusCode: res.statusCode,
      memoryUsage: memoryDelta,
      timestamp: new Date().toISOString(),
    };

    // Log slow requests
    if (duration > 1000) {
      logger.warn('Slow request detected', metrics);
    }

    // Log high memory usage
    if (memoryDelta.heapUsed > 50 * 1024 * 1024) { // 50MB
      logger.warn('High memory usage detected', metrics);
    }

    // Send metrics to monitoring system
    sendMetricsToMonitoring(metrics);
  });

  next();
}

function sendMetricsToMonitoring(metrics: PerformanceMetrics): void {
  // Send to Google Cloud Monitoring
  // Implementation depends on Cloud Monitoring API
}
```

### Database Query Monitoring

**File: `server/src/config/database-monitoring.ts`**

```typescript
import { PrismaClient } from '@prisma/client';
import { logger } from '../services/logger';

export function createMonitoredPrismaClient(): PrismaClient {
  const prisma = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
  });

  prisma.$on('query', (e: any) => {
    const duration = e.duration;
    
    // Log slow queries
    if (duration > 1000) {
      logger.warn('Slow database query', {
        query: e.query,
        params: e.params,
        duration,
        target: e.target,
      });
    }

    // Send metrics
    sendQueryMetrics({
      query: e.query,
      duration,
      target: e.target,
    });
  });

  prisma.$on('error', (e: any) => {
    logger.error('Database error', {
      message: e.message,
      target: e.target,
    });
  });

  return prisma;
}

function sendQueryMetrics(metrics: {
  query: string;
  duration: number;
  target: string;
}): void {
  // Send to Cloud Monitoring
}
```

## 4. Cost Monitoring

### Cloud Cost Tracking

**File: `server/src/services/cost-monitor.ts`**

```typescript
import { Billing } from '@google-cloud/billing';
import { logger } from './logger';
import { alertManager } from './alert-manager';

interface CostMetrics {
  service: string;
  cost: number;
  currency: string;
  period: string;
}

class CostMonitor {
  private billing: Billing;
  private budgetThresholds: Map<string, number>;

  constructor() {
    this.billing = new Billing({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });
    this.budgetThresholds = new Map([
      ['daily', 100], // $100/day
      ['weekly', 600], // $600/week
      ['monthly', 2500], // $2500/month
    ]);
  }

  async checkDailyCost(): Promise<void> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const cost = await this.getCostForPeriod(startOfDay, endOfDay);
    const threshold = this.budgetThresholds.get('daily') || 0;

    if (cost > threshold) {
      await alertManager.sendAlert(
        'high',
        'Daily Budget Exceeded',
        `Daily cost: $${cost.toFixed(2)} (threshold: $${threshold})`,
        {
          cost,
          threshold,
          period: 'daily',
        }
      );
    }

    logger.info('Daily cost check', {
      cost,
      threshold,
      period: 'daily',
    });
  }

  async checkMonthlyCost(): Promise<void> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const cost = await this.getCostForPeriod(startOfMonth, endOfMonth);
    const threshold = this.budgetThresholds.get('monthly') || 0;

    if (cost > threshold) {
      await alertManager.sendAlert(
        'critical',
        'Monthly Budget Exceeded',
        `Monthly cost: $${cost.toFixed(2)} (threshold: $${threshold})`,
        {
          cost,
          threshold,
          period: 'monthly',
        }
      );
    }
  }

  private async getCostForPeriod(start: Date, end: Date): Promise<number> {
    // Query Google Cloud Billing API
    // Implementation depends on Billing API
    return 0;
  }

  async getCostBreakdown(): Promise<CostMetrics[]> {
    // Get cost breakdown by service
    return [];
  }
}

export const costMonitor = new CostMonitor();
```

## 5. Operational Dashboards

### Grafana Dashboard Configuration

**File: `monitoring/grafana/dashboard.json`**

```json
{
  "dashboard": {
    "title": "BDN Backend - Operational Dashboard",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(cloud_run_requests_total[5m])",
            "legendFormat": "{{method}} {{status}}"
          }
        ]
      },
      {
        "title": "Response Time (p95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(cloud_run_request_duration_seconds_bucket[5m]))",
            "legendFormat": "p95"
          }
        ]
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(cloud_run_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "5xx errors"
          }
        ]
      },
      {
        "title": "Database Query Time",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(database_query_duration_seconds_bucket[5m]))",
            "legendFormat": "p95 query time"
          }
        ]
      },
      {
        "title": "Memory Usage",
        "targets": [
          {
            "expr": "cloud_run_memory_usage_bytes",
            "legendFormat": "{{instance}}"
          }
        ]
      },
      {
        "title": "Active Instances",
        "targets": [
          {
            "expr": "cloud_run_instance_count",
            "legendFormat": "Instances"
          }
        ]
      }
    ]
  }
}
```

### Cloud Monitoring Dashboard

**File: `monitoring/cloud-monitoring/dashboard.json`**

```json
{
  "displayName": "BDN Backend Dashboard",
  "mosaicLayout": {
    "columns": 12,
    "tiles": [
      {
        "width": 6,
        "height": 4,
        "widget": {
          "title": "Request Rate",
          "xyChart": {
            "dataSets": [
              {
                "timeSeriesQuery": {
                  "timeSeriesFilter": {
                    "filter": "resource.type=\"cloud_run_revision\"",
                    "aggregation": {
                      "alignmentPeriod": "60s",
                      "perSeriesAligner": "ALIGN_RATE"
                    }
                  }
                }
              }
            ]
          }
        }
      },
      {
        "width": 6,
        "height": 4,
        "widget": {
          "title": "Error Rate",
          "xyChart": {
            "dataSets": [
              {
                "timeSeriesQuery": {
                  "timeSeriesFilter": {
                    "filter": "resource.type=\"cloud_run_revision\" AND severity>=ERROR",
                    "aggregation": {
                      "alignmentPeriod": "60s",
                      "perSeriesAligner": "ALIGN_RATE"
                    }
                  }
                }
              }
            ]
          }
        }
      }
    ]
  }
}
```

## 6. Error Tracking

### Sentry Integration

**File: `server/src/services/error-tracker.ts`**

```typescript
import * as Sentry from '@sentry/node';
import { logger } from './logger';

class ErrorTracker {
  private initialized = false;

  initialize(): void {
    if (this.initialized) return;

    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      beforeSend(event, hint) {
        // Filter out sensitive data
        if (event.request) {
          delete event.request.headers?.authorization;
          delete event.request.cookies;
        }
        return event;
      },
    });

    this.initialized = true;
  }

  captureException(error: Error, context?: Record<string, any>): void {
    Sentry.withScope((scope) => {
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setContext(key, value);
        });
      }
      Sentry.captureException(error);
    });

    logger.error('Exception captured by Sentry', {
      error: error.message,
      stack: error.stack,
      ...context,
    });
  }

  captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): void {
    Sentry.captureMessage(message, level);
    logger.info('Message captured by Sentry', { message, level });
  }

  setUser(user: { id: string; email?: string }): void {
    Sentry.setUser(user);
  }
}

export const errorTracker = new ErrorTracker();
```

## 7. Business Metrics Dashboards

### Business Metrics Service

**File: `server/src/services/business-metrics.ts`**

```typescript
import { prisma } from '../config/database';
import { logger } from './logger';

interface BusinessMetrics {
  totalUsers: number;
  activeUsers: number; // Last 30 days
  totalTransactions: number;
  totalRevenue: number;
  averageTransactionValue: number;
  transactionsByType: Record<string, number>;
  revenueByCurrency: Record<string, number>;
  topBusinesses: Array<{ id: string; name: string; revenue: number }>;
}

class BusinessMetricsService {
  async getDailyMetrics(date: Date = new Date()): Promise<BusinessMetrics> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const [
      totalUsers,
      activeUsers,
      transactions,
      revenueData,
    ] = await Promise.all([
      prisma.user.count(),
      this.getActiveUsersCount(30),
      prisma.transaction.findMany({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: 'COMPLETED',
        },
      }),
      prisma.transaction.aggregate({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: 'COMPLETED',
        },
        _sum: {
          amount: true,
        },
        _avg: {
          amount: true,
        },
      }),
    ]);

    const transactionsByType = this.groupBy(transactions, 'type');
    const revenueByCurrency = this.groupRevenueByCurrency(transactions);

    return {
      totalUsers,
      activeUsers,
      totalTransactions: transactions.length,
      totalRevenue: revenueData._sum.amount || 0,
      averageTransactionValue: revenueData._avg.amount || 0,
      transactionsByType,
      revenueByCurrency,
      topBusinesses: await this.getTopBusinesses(startOfDay, endOfDay),
    };
  }

  private async getActiveUsersCount(days: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return prisma.user.count({
      where: {
        lastActiveAt: {
          gte: cutoffDate,
        },
      },
    });
  }

  private async getTopBusinesses(start: Date, end: Date) {
    // Implementation to get top businesses by revenue
    return [];
  }

  private groupBy<T>(array: T[], key: keyof T): Record<string, number> {
    return array.reduce((acc, item) => {
      const value = String(item[key]);
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private groupRevenueByCurrency(transactions: any[]): Record<string, number> {
    return transactions.reduce((acc, txn) => {
      const currency = txn.currency || 'USD';
      acc[currency] = (acc[currency] || 0) + txn.amount;
      return acc;
    }, {} as Record<string, number>);
  }
}

export const businessMetrics = new BusinessMetricsService();
```

## 8. Implementation Files

### New Files

- `server/src/services/logger.ts` - Cloud Logging integration
- `server/src/middleware/logging.ts` - Request/response logging
- `server/logging-policy.yaml` - Log retention policies
- `server/monitoring/alerts.yaml` - Alert configurations
- `server/src/services/alert-manager.ts` - Alert management
- `server/src/middleware/performance-monitoring.ts` - Performance monitoring
- `server/src/config/database-monitoring.ts` - Database query monitoring
- `server/src/services/cost-monitor.ts` - Cost tracking
- `monitoring/grafana/dashboard.json` - Grafana dashboard
- `monitoring/cloud-monitoring/dashboard.json` - Cloud Monitoring dashboard
- `server/src/services/error-tracker.ts` - Sentry integration
- `server/src/services/business-metrics.ts` - Business metrics

### Modified Files

- `server/src/server.ts` - Add logging and monitoring middleware
- `server/src/config/database.ts` - Add database monitoring
- `package.json` - Add monitoring dependencies

## 9. Success Metrics

**Monitoring:**
- Log ingestion rate > 99.9%
- Alert delivery time < 1 minute
- Dashboard load time < 2 seconds
- Metric collection accuracy > 99.9%

**Observability:**
- Mean Time To Detect (MTTD) < 5 minutes
- Mean Time To Resolve (MTTR) < 30 minutes
- Dashboard availability > 99.9%
- Log search response time < 1 second

**Cost:**
- Cost tracking accuracy 100%
- Budget alert delivery < 1 hour
- Cost optimization recommendations monthly
