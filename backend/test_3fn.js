const test = require('node:test');
const assert = require('node:assert');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

test('Mini-V-Model: Integridade Referencial (3FN) e Regras de Validação', async (t) => {
  const db = new sqlite3.Database(':memory:');
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

  await new Promise((resolve, reject) => {
    db.exec(schema, (err) => (err ? reject(err) : resolve()));
  });

  await t.test('Teste de Integração (DER/3FN): Bloqueia inserção com Foreign Key de obra inexistente', async () => {
    await assert.rejects(
      new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO FUNCIONARIO VALUES ('FUNC999', 'Teste FK', 'Servente', 'ATIVO', 'OBRA-INEXISTENTE')`,
          (err) => (err ? reject(err) : resolve())
        );
      }),
      /FOREIGN KEY constraint failed/
    );
  });

  await t.test('Teste de Unidade: Valida regra de negócio para crachá ativo vs suspenso', async () => {
    const ativo = await new Promise((res) =>
      db.get(`SELECT * FROM FUNCIONARIO WHERE codigo_cracha = 'FUNC001'`, (_, row) => res(row))
    );
    const suspenso = await new Promise((res) =>
      db.get(`SELECT * FROM FUNCIONARIO WHERE codigo_cracha = 'FUNC003'`, (_, row) => res(row))
    );

    assert.strictEqual(ativo.status_permissao, 'ATIVO');
    assert.strictEqual(suspenso.status_permissao, 'SUSPENSO');
  });

  db.close();
});
