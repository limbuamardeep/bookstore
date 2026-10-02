#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/6b39782f5d5fa4c0e9dd5d878b35195be6d0a172642530186c00df9410753cfc/contract';
import endContract from '../../snapshots/6b39782f5d5fa4c0e9dd5d878b35195be6d0a172642530186c00df9410753cfc/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/afcf93cb280e5fabd9ab532e7df6fb7838c13ec5560ffc982b22d31286fa7b92/contract';
import startContract from '../../snapshots/afcf93cb280e5fabd9ab532e7df6fb7838c13ec5560ffc982b22d31286fa7b92/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [];
  }
}

MigrationCLI.run(import.meta.url, M);
