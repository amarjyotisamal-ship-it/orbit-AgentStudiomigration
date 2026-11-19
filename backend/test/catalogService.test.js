import test from 'node:test';
import assert from 'node:assert/strict';
import { CatalogService } from '../src/services/catalogService.js';

test('CatalogService correctly filters agents by query and category', () => {
  const sample = [
    { id: 'a1', name: 'Sales Closer', category: 'Sales', externalApi: true },
    { id: 'a2', name: 'Content Writer', category: 'Content', externalApi: false },
    { id: 'a3', name: 'Email Sequence', category: 'Sales', externalApi: true }
  ];

  const sales = CatalogService.filterAgents(sample, { category: 'Sales' });
  assert.equal(sales.length, 2);

  const ready = CatalogService.filterAgents(sample, { readyOnly: true });
  assert.equal(ready.length, 2);

  const search = CatalogService.filterAgents(sample, { search: 'Content' });
  assert.equal(search.length, 1);
  assert.equal(search[0].id, 'a2');
});
