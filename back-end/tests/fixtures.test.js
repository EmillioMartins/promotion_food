import assert from 'node:assert/strict'
import test from 'node:test'
import { carregarDadosApi, fixtures } from '../src/fixtures/index.js'

const HOJE = '2026-10-05'

test('mapeia produtos para o contrato API e recalcula descontos por vencimento', () => {
  const dados = carregarDadosApi(HOJE)
  const suco = dados.products.find((produto) => produto.id === 7)
  const chocolate = dados.products.find((produto) => produto.id === 5)

  assert.equal(dados.products.length, 4)
  assert.equal(suco.discount, 75)
  assert.equal(suco.promoPrice, 3.73)
  assert.equal(chocolate.discount, 40)
  assert.equal(chocolate.promoPrice, 5.99)
  assert.equal('name' in suco, true)
  assert.equal('originalPrice' in suco, true)
  assert.equal('expiresAt' in suco, true)
})

test('não expõe senha no mapeamento público de usuários', () => {
  const dados = carregarDadosApi(HOJE)

  assert.equal(dados.users.length, 5)
  assert.equal(dados.users.every((usuario) => !Object.hasOwn(usuario, 'password')), true)
})

test('todos os pedidos apontam para clientes e produtos existentes', () => {
  const dados = carregarDadosApi(HOJE)
  const idsClientes = new Set(dados.users.map((usuario) => usuario.id))
  const idsProdutos = new Set(fixtures.products.map((produto) => produto.id))

  assert.equal(dados.orders.length, 5)
  for (const pedido of dados.orders) {
    assert.equal(idsClientes.has(pedido.clientId), true)
    for (const item of pedido.items) assert.equal(idsProdutos.has(item.productId), true)
  }
})
