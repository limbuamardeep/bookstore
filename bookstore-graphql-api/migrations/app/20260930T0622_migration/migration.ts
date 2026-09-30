#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/afcf93cb280e5fabd9ab532e7df6fb7838c13ec5560ffc982b22d31286fa7b92/contract';
import endContract from '../../snapshots/afcf93cb280e5fabd9ab532e7df6fb7838c13ec5560ffc982b22d31286fa7b92/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/e011410de8d8d4cfd81a68a4e555c1a108b11fa9b373e09e768366175e2622cf/contract';
import startContract from '../../snapshots/e011410de8d8d4cfd81a68a4e555c1a108b11fa9b373e09e768366175e2622cf/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [this.dropColumn({ schema: 'public', table: 'Book', column: 'name' })];
  }
}

MigrationCLI.run(import.meta.url, M);
