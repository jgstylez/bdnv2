---
name: Disaster Recovery & Business Continuity - Backup, Failover, Recovery
overview: Comprehensive disaster recovery and business continuity plan covering backup procedures, RTO/RPO targets, failover strategies, recovery procedures, and business continuity planning.
todos:
  - id: setup-automated-backups
    content: Set up automated database backups (daily, weekly, monthly)
    status: pending
  - id: setup-backup-verification
    content: Create backup verification and testing procedures
    status: pending
  - id: configure-database-failover
    content: Configure database failover (Cloud SQL high availability)
    status: pending
  - id: setup-multi-region-deployment
    content: Set up multi-region Cloud Run deployment
    status: pending
  - id: create-recovery-procedures
    content: Document recovery procedures and runbooks
    status: pending
  - id: setup-disaster-recovery-testing
    content: Set up regular disaster recovery testing schedule
    status: pending
  - id: create-incident-response-playbooks
    content: Create detailed incident response playbooks
    status: pending
  - id: setup-communication-plans
    content: Set up communication plans for incidents
    status: pending
---

# Disaster Recovery & Business Continuity Plan

## Overview

This plan establishes comprehensive disaster recovery and business continuity procedures for BDN 2.0, covering backup strategies, RTO/RPO targets, failover mechanisms, recovery procedures, and incident response.

## 1. Recovery Objectives

### Recovery Time Objectives (RTO)

**Target RTOs:**

- **Critical Systems (Payment Processing, Transactions):** < 15 minutes
- **Core Systems (API, Database):** < 30 minutes
- **Supporting Systems (Analytics, Reporting):** < 2 hours
- **Non-Critical Systems (Admin Tools):** < 4 hours

### Recovery Point Objectives (RPO)

**Target RPOs:**

- **Critical Data (Transactions, Wallets):** < 5 minutes (near-zero data loss)
- **User Data (Profiles, Preferences):** < 15 minutes
- **Business Data (Products, Inventory):** < 1 hour
- **Analytics Data:** < 4 hours

## 2. Backup Strategy

### Database Backup Configuration

**File: `server/scripts/backup-config.sh`**

```bash
#!/bin/bash
# Database backup configuration script

ENVIRONMENT=${1:-production}
PROJECT_ID="bdn-${ENVIRONMENT}"
INSTANCE_NAME="bdn-postgres-${ENVIRONMENT}"

# Create automated backup schedule
gcloud sql backups create \
  --instance=$INSTANCE_NAME \
  --description="Automated daily backup" \
  --async

# Configure backup retention
gcloud sql instances patch $INSTANCE_NAME \
  --backup-start-time=02:00 \
  --enable-bin-log \
  --backup-retention-settings=retained-backups=30,retention-unit=COUNT

echo "✅ Backup configuration completed"
```

### Automated Backup Script

**File: `server/scripts/backup-database.sh`**

```bash
#!/bin/bash
# Automated database backup script

set -e

ENVIRONMENT=${1:-production}
PROJECT_ID="bdn-${ENVIRONMENT}"
INSTANCE_NAME="bdn-postgres-${ENVIRONMENT}"
BACKUP_BUCKET="gs://bdn-backups-${ENVIRONMENT}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_NAME="backup-${TIMESTAMP}"

echo "🔄 Starting database backup..."
echo "Environment: $ENVIRONMENT"
echo "Instance: $INSTANCE_NAME"

# Create Cloud SQL backup
BACKUP_ID=$(gcloud sql backups create \
  --instance=$INSTANCE_NAME \
  --description="Manual backup: $BACKUP_NAME" \
  --async \
  --format='value(id)')

echo "📦 Backup created: $BACKUP_ID"

# Wait for backup to complete
echo "⏳ Waiting for backup to complete..."
gcloud sql operations wait $BACKUP_ID --instance=$INSTANCE_NAME

# Export to Cloud Storage (for additional redundancy)
echo "📤 Exporting to Cloud Storage..."
gcloud sql export sql $INSTANCE_NAME \
  $BACKUP_BUCKET/$BACKUP_NAME.sql \
  --database=bdn \
  --offload

# Verify backup
echo "✅ Verifying backup..."
BACKUP_STATUS=$(gcloud sql backups describe $BACKUP_ID --instance=$INSTANCE_NAME --format='value(status)')

if [ "$BACKUP_STATUS" != "SUCCESSFUL" ]; then
  echo "❌ Backup failed!"
  exit 1
fi

echo "✅ Backup completed successfully: $BACKUP_ID"
echo "📦 Backup location: $BACKUP_BUCKET/$BACKUP_NAME.sql"
```

### Backup Verification Script

**File: `server/scripts/verify-backup.sh`**

```bash
#!/bin/bash
# Backup verification script

set -e

ENVIRONMENT=${1:-production}
BACKUP_ID=${2}

if [ -z "$BACKUP_ID" ]; then
  echo "Usage: ./verify-backup.sh <environment> <backup-id>"
  exit 1
fi

INSTANCE_NAME="bdn-postgres-${ENVIRONMENT}"
TEST_INSTANCE="bdn-postgres-test-restore"

echo "🔍 Verifying backup: $BACKUP_ID"

# Create test instance from backup
echo "📦 Creating test instance from backup..."
gcloud sql instances create $TEST_INSTANCE \
  --source-backup=$BACKUP_ID \
  --source-instance=$INSTANCE_NAME \
  --tier=db-f1-micro \
  --region=us-central1

# Wait for instance to be ready
echo "⏳ Waiting for test instance to be ready..."
sleep 60

# Connect and verify data
echo "🔍 Verifying data integrity..."
PGPASSWORD=$(gcloud sql users list --instance=$TEST_INSTANCE --format='value(password)') \
psql -h $(gcloud sql instances describe $TEST_INSTANCE --format='value(ipAddresses[0].ipAddress)') \
  -U postgres \
  -d bdn \
  -c "SELECT COUNT(*) FROM transactions;" || {
    echo "❌ Backup verification failed!"
    gcloud sql instances delete $TEST_INSTANCE --quiet
    exit 1
  }

echo "✅ Backup verification successful"

# Clean up test instance
echo "🧹 Cleaning up test instance..."
gcloud sql instances delete $TEST_INSTANCE --quiet

echo "✅ Backup verification completed"
```

### Backup Schedule

**Daily Backups:**
- Time: 2:00 AM UTC
- Retention: 30 days
- Type: Full backup + transaction logs

**Weekly Backups:**
- Time: Sunday 2:00 AM UTC
- Retention: 12 weeks (3 months)
- Type: Full backup

**Monthly Backups:**
- Time: First day of month, 2:00 AM UTC
- Retention: 12 months (1 year)
- Type: Full backup + archive to cold storage

## 3. Database Failover

### Cloud SQL High Availability Configuration

**File: `server/scripts/setup-ha-database.sh`**

```bash
#!/bin/bash
# Set up high availability database

ENVIRONMENT=${1:-production}
INSTANCE_NAME="bdn-postgres-${ENVIRONMENT}"
PRIMARY_REGION="us-central1"
FAILOVER_REGION="us-east1"

echo "🔄 Setting up high availability database..."

# Enable high availability
gcloud sql instances patch $INSTANCE_NAME \
  --availability-type=REGIONAL \
  --enable-bin-log \
  --backup-start-time=02:00

# Create read replica in failover region
gcloud sql instances create ${INSTANCE_NAME}-replica \
  --master-instance-name=$INSTANCE_NAME \
  --region=$FAILOVER_REGION \
  --tier=db-n1-standard-2 \
  --availability-type=ZONAL

echo "✅ High availability configured"
echo "Primary: $PRIMARY_REGION"
echo "Replica: $FAILOVER_REGION"
```

### Failover Script

**File: `server/scripts/failover-database.sh`**

```bash
#!/bin/bash
# Database failover script

set -e

ENVIRONMENT=${1:-production}
INSTANCE_NAME="bdn-postgres-${ENVIRONMENT}"
REPLICA_NAME="${INSTANCE_NAME}-replica"

echo "🔄 Initiating database failover..."
echo "Primary: $INSTANCE_NAME"
echo "Replica: $REPLICA_NAME"

# Promote replica to primary
echo "📦 Promoting replica to primary..."
gcloud sql instances promote-replica $REPLICA_NAME

# Update application configuration
echo "🔧 Updating application configuration..."
NEW_PRIMARY_IP=$(gcloud sql instances describe $REPLICA_NAME --format='value(ipAddresses[0].ipAddress)')

# Update Cloud Run environment variables
gcloud run services update bdn-backend-$ENVIRONMENT \
  --region=us-central1 \
  --update-env-vars DATABASE_URL="postgresql://user:pass@$NEW_PRIMARY_IP:5432/bdn"

echo "✅ Failover completed"
echo "New primary: $REPLICA_NAME"
echo "IP: $NEW_PRIMARY_IP"
```

## 4. Multi-Region Deployment

### Cloud Run Multi-Region Configuration

**File: `server/scripts/setup-multi-region.sh`**

```bash
#!/bin/bash
# Set up multi-region Cloud Run deployment

ENVIRONMENT=${1:-production}
PRIMARY_REGION="us-central1"
SECONDARY_REGION="us-east1"

echo "🌍 Setting up multi-region deployment..."

# Deploy to primary region
gcloud run deploy bdn-backend-$ENVIRONMENT \
  --image gcr.io/bdn-$ENVIRONMENT/bdn-backend:latest \
  --region $PRIMARY_REGION \
  --platform managed

# Deploy to secondary region
gcloud run deploy bdn-backend-$ENVIRONMENT \
  --image gcr.io/bdn-$ENVIRONMENT/bdn-backend:latest \
  --region $SECONDARY_REGION \
  --platform managed

# Configure load balancing
gcloud compute backend-services create bdn-backend-service \
  --global \
  --load-balancing-scheme=EXTERNAL

# Add backend services
gcloud compute backend-services add-backend bdn-backend-service \
  --global \
  --network-endpoint-group=bdn-backend-$ENVIRONMENT \
  --network-endpoint-group-region=$PRIMARY_REGION

gcloud compute backend-services add-backend bdn-backend-service \
  --global \
  --network-endpoint-group=bdn-backend-$ENVIRONMENT \
  --network-endpoint-group-region=$SECONDARY_REGION

echo "✅ Multi-region deployment configured"
```

## 5. Recovery Procedures

### Database Recovery Runbook

**File: `docs/runbooks/database-recovery.md`**

```markdown
# Database Recovery Runbook

## Scenario: Database Corruption

### Symptoms
- Database queries failing
- Error logs showing corruption messages
- Application unable to connect

### Recovery Steps

1. **Immediate Actions**
   - [ ] Stop application traffic (set Cloud Run to 0 instances)
   - [ ] Identify last known good backup
   - [ ] Notify team via PagerDuty

2. **Restore from Backup**
   ```bash
   ./scripts/restore-database.sh production <backup-id>
   ```

3. **Verify Restoration**
   ```bash
   ./scripts/verify-backup.sh production <backup-id>
   ```

4. **Resume Operations**
   - [ ] Verify data integrity
   - [ ] Restart application
   - [ ] Monitor for issues
   - [ ] Gradually increase traffic

### RTO: 30 minutes
### RPO: 5 minutes (last backup)

## Scenario: Complete Database Loss

### Recovery Steps

1. **Create New Instance**
   ```bash
   gcloud sql instances create bdn-postgres-production-restored \
     --tier=db-n1-standard-2 \
     --region=us-central1
   ```

2. **Restore from Most Recent Backup**
   ```bash
   gcloud sql backups restore <backup-id> \
     --backup-instance=bdn-postgres-production \
     --restore-instance=bdn-postgres-production-restored
   ```

3. **Update Application Configuration**
   - Update DATABASE_URL environment variable
   - Restart Cloud Run services

4. **Verify and Resume**
   - Run data integrity checks
   - Monitor application health
   - Gradually resume traffic
```

### Application Recovery Runbook

**File: `docs/runbooks/application-recovery.md`**

```markdown
# Application Recovery Runbook

## Scenario: Application Crash

### Symptoms
- All instances unhealthy
- Health checks failing
- High error rate

### Recovery Steps

1. **Immediate Actions**
   - [ ] Check Cloud Run logs for errors
   - [ ] Identify root cause
   - [ ] Rollback to previous revision if needed

2. **Rollback Procedure**
   ```bash
   ./scripts/rollback.sh production <previous-revision>
   ```

3. **If Rollback Fails**
   - [ ] Deploy known good image version
   - [ ] Verify health checks pass
   - [ ] Gradually increase traffic

### RTO: 15 minutes

## Scenario: Regional Outage

### Recovery Steps

1. **Failover to Secondary Region**
   ```bash
   ./scripts/failover-region.sh production
   ```

2. **Update DNS/CDN**
   - Point traffic to secondary region
   - Verify connectivity

3. **Monitor Secondary Region**
   - Check application health
   - Monitor error rates
   - Verify database connectivity

4. **Failback Procedure** (when primary recovers)
   ```bash
   ./scripts/failback-region.sh production
   ```
```

## 6. Incident Response Playbooks

### Critical Incident Response

**File: `docs/playbooks/critical-incident.md`**

```markdown
# Critical Incident Response Playbook

## Severity Levels

### P0 - Critical (Immediate Response)
- Complete service outage
- Data breach
- Payment processing failure
- Database corruption

### P1 - High (Response within 1 hour)
- Partial service outage
- High error rate
- Performance degradation

### P2 - Medium (Response within 4 hours)
- Non-critical feature failure
- Minor performance issues

## Response Procedure

### 1. Detection
- Automated alerts trigger
- On-call engineer notified
- Incident created in tracking system

### 2. Triage
- [ ] Assess severity
- [ ] Identify affected systems
- [ ] Estimate impact
- [ ] Assign incident commander

### 3. Communication
- [ ] Update status page
- [ ] Notify stakeholders
- [ ] Create incident channel
- [ ] Set up war room if needed

### 4. Resolution
- [ ] Follow appropriate runbook
- [ ] Implement fix
- [ ] Verify resolution
- [ ] Monitor for recurrence

### 5. Post-Incident
- [ ] Document incident
- [ ] Conduct post-mortem
- [ ] Update runbooks
- [ ] Implement preventive measures
```

## 7. Disaster Recovery Testing

### DR Test Schedule

**Quarterly Tests:**
- Database backup restoration
- Failover procedures
- Multi-region failover

**Annual Tests:**
- Complete disaster scenario
- Full system recovery
- Communication plan testing

### DR Test Script

**File: `server/scripts/dr-test.sh`**

```bash
#!/bin/bash
# Disaster recovery test script

set -e

echo "🧪 Starting Disaster Recovery Test"
echo "Date: $(date)"

# Test 1: Backup Verification
echo "📦 Test 1: Verifying latest backup..."
LATEST_BACKUP=$(gcloud sql backups list \
  --instance=bdn-postgres-sandbox \
  --limit=1 \
  --format='value(id)')

./scripts/verify-backup.sh sandbox $LATEST_BACKUP || {
  echo "❌ Backup verification failed"
  exit 1
}

# Test 2: Database Failover
echo "🔄 Test 2: Testing database failover..."
./scripts/failover-database.sh sandbox || {
  echo "❌ Failover test failed"
  exit 1
}

# Test 3: Application Recovery
echo "🚀 Test 3: Testing application recovery..."
./scripts/rollback.sh sandbox-backend <previous-revision> || {
  echo "❌ Application recovery test failed"
  exit 1
}

# Test 4: Multi-Region Failover
echo "🌍 Test 4: Testing multi-region failover..."
./scripts/failover-region.sh sandbox || {
  echo "❌ Multi-region failover test failed"
  exit 1
}

echo "✅ All DR tests passed"
```

## 8. Communication Plans

### Incident Communication Template

**File: `docs/templates/incident-communication.md`**

```markdown
# Incident Communication Template

## Status Update

**Incident ID:** INC-{number}
**Severity:** {P0/P1/P2}
**Status:** {Investigating/Mitigating/Resolved}
**Affected Services:** {list}
**Impact:** {description}

## Timeline

- {time} - Incident detected
- {time} - Investigation started
- {time} - Root cause identified
- {time} - Fix implemented
- {time} - Service restored

## Next Update

Next update in {time} or when status changes.
```

## 9. Implementation Files

### New Files

- `server/scripts/backup-config.sh` - Backup configuration
- `server/scripts/backup-database.sh` - Automated backup
- `server/scripts/verify-backup.sh` - Backup verification
- `server/scripts/setup-ha-database.sh` - HA database setup
- `server/scripts/failover-database.sh` - Database failover
- `server/scripts/setup-multi-region.sh` - Multi-region setup
- `server/scripts/dr-test.sh` - DR testing script
- `docs/runbooks/database-recovery.md` - Database recovery runbook
- `docs/runbooks/application-recovery.md` - Application recovery runbook
- `docs/playbooks/critical-incident.md` - Incident response playbook
- `docs/templates/incident-communication.md` - Communication template

### Modified Files

- `server/src/config/database.ts` - Add failover configuration
- `.github/workflows/backup.yml` - Automated backup workflow

## 10. Success Metrics

**Backup:**
- Backup success rate > 99.9%
- Backup verification success rate 100%
- Backup restoration time < 30 minutes
- Zero backup failures

**Recovery:**
- RTO achievement > 95%
- RPO achievement > 99%
- Recovery success rate 100%
- Zero data loss incidents

**Testing:**
- DR tests executed quarterly
- DR test success rate > 95%
- Runbook accuracy > 90%
- Incident response time < target RTO
